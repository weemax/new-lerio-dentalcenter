# SMS provider research — PhilSMS vs Semaphore for Lerio Dental Center booking notifications

Research spike output. Decision: which provider becomes the v1 primary for the
booking notification flow (`booking_pending_patient`, `booking_confirmed_patient`,
`booking_reminder_24h`)? Twilio, MessageBird, Plivo, Vonage and any other
provider are out of scope per operator decision (`docs/operator-answers.md`
"Out of scope").

All claims in this document are sourced from public documentation, official
provider pages, or third-party comparison reports. URLs are inline as
footnotes so the implementation swarm can verify each cell of the comparison
table.

---

## 1. Side-by-side comparison

| Dimension | PhilSMS | Semaphore |
|---|---|---|
| **Auth model** | Bearer token (`Authorization: Bearer <api_token>`) issued from the dashboard; v3 REST API.[^philsms-docs] | API key in `apikey` POST field (form-encoded); v4 REST API.[^sem-docs] |
| **API shape** | `POST https://app.philsms.com/api/v3/sms/send` with JSON body `{sender_id, recipient, message}`. Response `{status:"success", data:{...}}`. Content-Type: `application/json`. PHP-only community SDK (`jaydoesphp/philsms-php`); no official Node.js SDK.[^philsms-docs][^philsms-sdk] | `POST https://api.semaphore.co/api/v4/messages` with form body `apikey=&number=&message=&sendername=`. Response is a JSON array of message objects with `message_id`, `network`, `status`. Official composer PHP client (`kickstartph/semaphore-client`); no official Node.js SDK.[^sem-docs][^sem-composer] |
| **Sender ID registration** | Free; up to 11 alphanumeric characters; 2–3 business days for telco approval; multiple SIDs per account; no app-form upload described in public docs but inferred from "You can also register multiple SID per account and it is completely FREE".[^philsms-home] | Free for the first Sender Name; additional Sender Names are billed at 200 credits/month or 2,000 credits/year. Up to 11 alphanumeric chars; up to 5 business days for approval; sender name cannot impersonate telcos (SMART/GLOBE/SUN blocked) and cannot contain "TEST"/"MESSAGE"/"SMS" unless approved through a separate form.[^sem-faq] |
| **Carrier coverage** | Official routes from SMART, DITO, and GLOBE. Philippines-only. No mention of Sun Cellular or Cherry Prepaid in the public marketing — only "PH numbers" generically.[^philsms-home] | Globe, Smart, Sun, DITO. Philippines-only. Marketing explicitly lists Sun.[^sem-home][^sem-docs] |
| **DLR / delivery receipts** | **No documented webhook.** Status available by polling `GET /api/v3/sms` (paged) or by reading dashboard reports. No DLR URL parameter on the send endpoint.[^philsms-docs] | **No documented webhook on outbound.** Status available via synchronous response (`queued`/`pending`/`sent`/`failed`/`refunded`) and via `GET /api/v4/messages/{id}` for refresh, or paged list `GET /api/v4/messages?status=…&network=…`. Status values per the FAQ.[^sem-docs][^sem-faq] |
| **Cost per SMS to PH mobile (PHP)** | Starts at ₱0.35 per SMS, no minimum top-up, no monthly fees. Pricing visible only after login; per-network breakdown not public, but marketing says "Starts at ₱0.35".[³][^philsms-home] | ₱0.56 per SMS **inclusive of VAT** per credit (1 credit = 1 SMS up to 160 bytes). Long messages billed per 153-byte segment. Same rate across all PH networks — no per-network tier published.[^sem-faq][^sent] |
| **PH regulatory** | PhilGEPS-accredited. Sender ID registration handled in-dashboard; compliance posture aligned with NTC rules of thumb. No published opt-out keyword handling beyond what telcos enforce.[^philsms-home] | Aligns with NTC: Sender Name approval form, prohibition on telco-impersonating names, content restrictions (no gambling/adult/etc. without separate approval). Quiet hours and opt-out handling are best-effort at the network layer, not at Semaphore.[^sem-faq][^sent] |
| **Cloudflare Workers compatibility** | Pure HTTPS POST with Bearer header and JSON body. No `fs`, no streaming, no native deps. Works with the standard `fetch` API in Workers (no `nodejs_compat` required). Bearer auth means the API token is held in a `wrangler secret` (`PHILSMS_API_TOKEN`).[^cf-fetch][^cf-buffer] | Form-encoded POST with `apikey` in the body — also a single HTTPS round-trip from `fetch()`. No `fs`/streaming/gotchas. The `apikey` body field is fine for a server-to-server Worker but means the key shows in request logs (mitigation: redact from `console.log` and don't enable Logpush for unredacted request bodies).[^cf-fetch] |

**Net of the table.** PhilSMS is materially cheaper at the headline rate
(₱0.35 vs ₱0.56 per SMS) and uses Bearer-token auth (cleaner for Workers). But
Semaphore is the only one of the two that publicly documents per-message
status values returned synchronously and a `GET /api/v4/messages/{id}` polling
endpoint, plus an explicit list of all four PH carriers including Sun.

---

## 2. Per-provider deep dive

### 2.1 PhilSMS

**Integration pattern.** Curl-only or the third-party
`jaydoesphp/philsms-php` Composer library[^philsms-sdk]. No official Node.js
SDK. From a Cloudflare Worker this is a single `fetch()` POST to
`https://app.philsms.com/api/v3/sms/send` with `Authorization: Bearer <token>`
and a JSON body. The standard Workers fetch API covers it without any
`nodejs_compat` flag.

**Auth flow.** The provider's dashboard issues an `api_token` (visible at
`https://app.philsms.com/developers` once logged in). The Worker stores it as
a Cloudflare secret: `wrangler secret put PHILSMS_API_TOKEN`. Bearer-token
auth means the token rides in the request header — no body-field leakage, no
signing.

**Send-request shape.**

```ts
// TypeScript sketch for a Cloudflare Worker (do not commit as code yet).
const res = await fetch("https://app.philsms.com/api/v3/sms/send", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${env.PHILSMS_API_TOKEN}`,
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
  body: JSON.stringify({
    sender_id: "LERIO DENTAL",          // pre-registered Sender ID
    recipient: "+639171234567",          // E.164 with +63 country code
    message: "Hi Mia, your booking at Lerio Dental on Jul 10 09:00 is confirmed.",
    // type: "unicode" omitted — default is plain GSM 7-bit
  }),
});
const json = await res.json() as { status: "success" | "error"; data?: unknown; message?: string };
if (json.status !== "success") throw new Error(`philsms send failed: ${json.message}`);
```

**Delivery receipt handling.** PhilSMS has **no documented webhook** in its
public v3 API docs[^philsms-docs]. The send response is synchronous and
returns only the message envelope — no `message_id`, no carrier, no terminal
status. To get delivery state the implementation must poll `GET
/api/v3/sms` (paginated) and match on the recipient + body or save the
provider's response id when/if it appears. Practical implication: the Worker
either polls on a schedule, or accepts that `notifications.status` in D1 will
be `sent` (carrier-accepted) rather than `delivered` (handset-confirmed).

**Sender ID registration.** Done inside the PhilSMS dashboard; free; up to 11
alphanumeric characters; **2–3 business days** for telco approval[^philsms-home].
A pre-registered SID like `LERIO DENTAL` (12 chars including the space) **will
not be accepted** because the limit is 11 — the recommendation for this
clinic is `LERIO DNTL` (10 chars) or similar. The dashboard route to register
is not surfaced in the public docs page; it is reached after sign-in. Plan to
register on day 1 of integration so the 2–3 day approval runs in parallel
with Worker development.

**Known gotchas.**

- Headline price ₱0.35 is the *starting* rate; actual rates are gated behind
  login. Treat ₱0.35 as a floor for budget purposes.[^philsms-home][^sent]
- No public per-network pricing breakdown. The implementation will not be
  able to report cost by carrier until the dashboard is consulted.
- No webhook means delivery analytics are weaker than Semaphore's.
- "1-year credit validity, refreshed on every top-up" — relevant for budget
  pacing; spend doesn't expire if topped up.[^philsms-home]
- Sandbox sender: not documented. Development testing must be done against
  real numbers; use the operator's own TM/DITO phones for the dev cycle.
- Filipino characters (diacritics: ñ, é, etc.) require `"type": "unicode"`
  and bill as multi-segment. UTF-8 in the body is fine; just be aware that
  one Filipino SMS at 70 GSM characters can become 2 Unicode segments.

### 2.2 Semaphore

**Integration pattern.** Curl, PHP `kickstartph/semaphore-client`, or any
language's HTTP client — pure HTTPS. From a Cloudflare Worker this is a
single `fetch()` POST to `https://api.semaphore.co/api/v4/messages` with
form-encoded body. No official Node.js SDK; community wrappers on PyPI
(`semaphore-sms`)[^sem-py] exist but Workers don't need them.

**Auth flow.** The provider's dashboard issues an API key. The Worker stores
it as a Cloudflare secret: `wrangler secret put SEMAPHORE_API_KEY`. The key
travels in the form body as `apikey=…` — that means the Worker's outbound
HTTP request body contains the key. Mitigation: keep the key only in
`env.SEMAPHORE_API_KEY`, never log `event.request.body` (or redact before
logpush). This is a minor hygiene concern, not a blocker.

**Send-request shape.**

```ts
// TypeScript sketch for a Cloudflare Worker (do not commit as code yet).
const form = new URLSearchParams({
  apikey: env.SEMAPHORE_API_KEY,         // comes from wrangler secret
  number: "+639171234567",               // E.164; Semaphore accepts 09xx, 9xx, or +639xx formats
  message: "Hi Mia, your booking at Lerio Dental on Jul 10 09:00 is confirmed.",
  sendername: "LERIO DNTL",              // pre-registered Sender Name (11 chars max)
});
const res = await fetch("https://api.semaphore.co/api/v4/messages", {
  method: "POST",
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
  body: form.toString(),
});
const arr = await res.json() as Array<{
  message_id: number;
  recipient: string;
  network: string;            // "Globe" | "Smart" | "Sun" | "DITO"
  status: "Queued" | "Pending" | "Sent" | "Failed" | "Refunded";
  sender_name: string;
}>;
const msg = arr[0];
if (!msg || msg.status === "Failed") throw new Error(`semaphore send failed`);
```

Semaphore also exposes:

- `POST /api/v4/priority` — bypasses the queue (2 credits per 160-char SMS).
- `POST /api/v4/otp` — OTP-only traffic (2 credits per SMS). Not relevant
  for booking notifications.

**Delivery receipt handling.** Semaphore has **no documented webhook for
outbound delivery status** in the public v4 docs[^sem-docs]. The response
synchronously returns a `status` field whose lifecycle is
`Queued → Pending → Sent | Failed → Refunded`[^sem-faq]. The implementation
can call `GET /api/v4/messages/{id}` to refresh status on a schedule, or
filter paged via `GET /api/v4/messages?status=…&network=…&startDate=…`. The
`network` field is returned synchronously, which is the closest either
provider gets to "I know which carrier the patient is on" — useful for the
`carrier` analytics column in `notifications`.

**Sender ID registration.** Done inside the Semaphore account dashboard;
first Sender Name is **free**, additional names are billed at 200 credits/month
or 2,000 credits/year[^sem-faq]. Up to 11 alphanumeric characters. Approval
takes **up to 5 business days** (slower than PhilSMS' 2–3 days)[^sem-faq].
Restrictions: cannot impersonate telcos (SMART, GLOBE, SUN), cannot contain
TEST/MESSAGE/SMS substrings without a separate approval form. `LERIO DENTAL`
is too long (12 chars) — same constraint as PhilSMS; use `LERIO DNTL`.

**Known gotchas.**

- Messages whose body **starts with the word "TEST"** are silently dropped
  at the network level. Implementation must never let template content begin
  with "test" — even when staging.[^sem-faq]
- Priority and OTP endpoints bill 2 credits per 160-char SMS; only relevant
  if we ever need a guaranteed-immediate channel. Not on the table for v1
  booking notifications.
- `apikey` in body means key hygiene in logs is a must. Not a hard blocker,
  but a minor process burden.
- Bulk endpoint supports up to 1,000 recipients per call to dodge per-call
  throttling. Irrelevant for booking notifications (one recipient per call),
  but documented here because future bulk campaigns (e.g. holiday closures)
  may use it.
- Rate limits: `/messages` POST is 120/min; `/messages` GET is 30/min;
  `/account/*` GET is 2/min[^sem-docs]. Comfortably above our booking
  notification volume (3 SMS × 50–200 bookings/week = 21–84 SMS/week).
- Filipino character set: no Unicode-specific docs, but the body is plain
  UTF-8 in the form field and Semaphore's pricing model uses the standard
  GSM 7-bit vs UCS-2 split (GSM-7: 160 chars; Unicode: 70 chars per
  segment). Templates should be authored in English to stay GSM-7 unless
  Filipino characters are explicitly needed.

---

## 3. Recommendation

**Use Semaphore as v1 primary.** Three reasons:

1. **Synchronous status + per-message network.** The send response includes
   a `status` enum and a `network` field ("Globe" | "Smart" | "Sun" |
   "DITO"). Neither field is documented for PhilSMS. This maps directly onto
   the proposed `notifications.dlr_status` and `notifications.carrier`
   columns without a second poll — the Worker can write both at insert
   time, and `GET /api/v4/messages/{id}` is a cheap refresh on the 24h
   reminder path.[^sem-docs]
2. **Explicit four-carrier coverage.** Semaphore's marketing lists Globe,
   Smart, Sun, and DITO. The clinic's two published numbers are TM (0936-…)
   and DITO (0992-…); both fit. PhilSMS lists only "PH numbers" with a
   mention of SMART/DITO/GLOBE for routing — Sun is not explicitly named.[^philsms-home][^sem-home]
3. **Worst-case fallback is the other direction.** If Semaphore is down, the
   Worker can swap to PhilSMS by changing a single env var; the data model
   stays the same (provider-agnostic `provider_id`, `provider_response_id`,
   `carrier` columns). Going PhilSMS-first and falling back to Semaphore is
   also possible, but losing per-message network visibility in the steady
   state is the bigger downside.

**Why not PhilSMS-primary.** Cheaper at ₱0.35 vs ₱0.56 per SMS, but the
implementation pays for it twice over:

- No synchronous carrier or status in the response — `notifications.carrier`
  is permanently unknown unless we poll-and-match later.
- No documented webhook either; both providers are poll-based, but Semaphore
  at least gives a `status` field we can write into the `notifications` row
  at insert time, which the Cloudflare cron can refresh later if needed.

For 50–200 bookings/week × 3 SMS = 150–600 SMS/week = 600–2,400 SMS/month,
the ₱0.21/SMS difference is ₱126–₱504/month. That is a real but small cost
relative to the analytics visibility Semaphore returns.

**Fallback posture.** Keep PhilSMS as a documented fallback. The Worker
should encapsulate provider selection behind a tiny adapter
(`sendSms(provider, payload) → {providerId, status, carrier}`); switching
primary is a single env-var change plus a redeploy, no schema migration.

---

## 4. D1 schema notes

The existing `notifications` table in `docs/amelia-review.md` section 3.8 is
**partially sufficient** but needs four column additions to support the
Semaphore primary path. Recommend applying the deltas as a non-blocking
additive migration under `migrations/99_review/v1.x_sms_provider_deltas/`
per the project's staged-review convention.

Existing table (from `docs/amelia-review.md` §3.8):

```sql
CREATE TABLE notifications (
  id           INTEGER PRIMARY KEY,
  booking_id   INTEGER,
  channel      TEXT NOT NULL,                      -- 'email' | 'sms'
  recipient    TEXT NOT NULL,                      -- email address or e164 phone
  template     TEXT NOT NULL,
  payload      TEXT,
  status       TEXT NOT NULL,                      -- 'sent' | 'failed' | 'queued'
  provider_id  TEXT,                               -- upstream message id
  error        TEXT,
  attempt      INTEGER NOT NULL DEFAULT 1,
  created_at   TEXT NOT NULL,
  CHECK (channel IN ('email', 'sms')),
  CHECK (status IN ('queued','sent','failed'))
);
```

Recommended additive columns:

```sql
ALTER TABLE notifications ADD COLUMN provider       TEXT;       -- 'semaphore' | 'philsms'
ALTER TABLE notifications ADD COLUMN sender_id      TEXT;       -- Sender Name used (e.g. 'LERIO DNTL')
ALTER TABLE notifications ADD COLUMN carrier        TEXT;       -- 'Globe' | 'Smart' | 'Sun' | 'DITO' | NULL
ALTER TABLE notifications ADD COLUMN dlr_status     TEXT;       -- lifecycle state from provider
ALTER TABLE notifications ADD COLUMN dlr_received_at TEXT;       -- ISO-8601 UTC; NULL until first refresh
ALTER TABLE notifications ADD COLUMN segments       INTEGER;    -- billing segments (1+)
ALTER TABLE notifications ADD COLUMN cost_centavos  INTEGER;    -- tracked cost in centavos (1 PHP = 100 centavos)

-- relax the CHECK so we can persist Semaphore's richer status enum
-- existing CHECK (status IN ('queued','sent','failed')) stays; we add dlr_status
-- as a separate lifecycle column rather than overloading status.

CREATE INDEX idx_notifications_dlr
  ON notifications (provider, dlr_status, created_at);
```

**Why these deltas.**

- `provider` — distinguish primary vs fallback in `audit_log`-style queries
  without parsing `provider_id`.
- `sender_id` — which registered Sender Name was active for this send.
  Useful when the clinic later registers a second name (e.g. `LERIO RMD`)
  for reminders vs confirmations.
- `carrier` — populated synchronously by Semaphore from the `network` field
  in the send response. Lets the admin dashboard answer "which carrier
  failed most this month?" without re-querying the provider.
- `dlr_status` — provider's terminal/intermediate state. Maps Semaphore's
  `Queued|Pending|Sent|Failed|Refunded`. Kept separate from `status` because
  `status` is our booking-flow concept (`queued`/`sent`/`failed`) and
  `dlr_status` is the upstream provider's lifecycle; the two can disagree
  (we mark `sent` once the provider accepted the request, but `dlr_status`
  only reaches `Sent` once the network confirms handset delivery).
- `dlr_received_at` — when the cron last refreshed `dlr_status`. Drives
  the 24h-reminder cron's "did the previous batch deliver?" check.
- `segments` and `cost_centavos` — billing observability. The reminder
  cron pulls `cost_centavos` for a monthly cost rollup. 1 PHP = 100
  centavos keeps arithmetic integer.

**Status enum widening.** The existing `CHECK (status IN
('queued','sent','failed'))` stays. The provider's lifecycle goes into
`dlr_status`, which has no CHECK in the delta above — keep it open so a
provider that introduces a new value (e.g. `Expired`) does not break our
writes.

---

## 5. Cost projection

Assumptions: 3 SMS per booking (pending confirmation, approved confirmation,
24h reminder — per `docs/operator-answers.md` §3), all single-segment
(English, GSM-7). Semaphore pricing per FAQ is ₱0.56/SMS inclusive of VAT;
PhilSMS headline is ₱0.35/SMS (treat as upper-bound estimate).

| Volume | SMS/week | SMS/month | Semaphore (₱0.56/SMS) | PhilSMS (₱0.35/SMS, est.) | Monthly delta (PhilSMS − Semaphore) |
|---|---|---|---|---|---|
| 50 bookings/week | 150 | 600 | **₱336** | ~₱210 | −₱126 |
| 200 bookings/week | 600 | 2,400 | **₱1,344** | ~₱840 | −₱504 |

Annualised (50/week steady): ~₱4,032 vs ~₱2,520 → ₱1,512/year saving on
PhilSMS. This is the cost of the analytics-visibility trade-off documented
in §3 — a sub-₱100/month line item for a clinic that is otherwise running on
Resend (free tier) + Cloudflare (free tier).

**Recommendation holds.** The cost gap does not change the recommendation
unless clinic volume crosses ~1,000 bookings/week (5× the 200/week upper
scenario), at which point the ₱2,500+/month saving on PhilSMS starts to
matter and a re-evaluation should be triggered. For Lerio Dental's actual
volume (likely <100 bookings/week — single clinic, 3 dentists, 6 days/week)
Semaphore is the right call.

---

## 6. Open questions for the operator

1. **Sender Name choice.** `LERIO DENTAL` is 12 characters (including the
   space); both providers cap SIDs at 11 alphanumeric characters. We need
   the clinic's preferred 11-character form. Options to present:
   - `LERIO DNTL` (10) — closest to the brand name
   - `LerioDent` (9) — camel-case, no space
   - `LERIODENTAL` (10) — one word, all-caps
   - Or split: e.g. `LERIO` for confirmations, `LerioRMD` for reminders
   The decision affects `notifications.sender_id` audit columns and (if
   multi-SID) the PhilSMS additional-SID billing on Semaphore.

2. **Unicode / Filipino characters.** Are Filipino templates shipped in v1
   going to use diacritics (ñ, é, etc.)? If yes, every Filipino SMS becomes
   a UCS-2 message and bills as multi-segment (1 SMS → 70 char limit;
   153-char segments if longer). Per `docs/operator-answers.md` §12 we ship
   English + Filipino templates. Confirm whether Filipino templates use
   diacritics or ASCII-only (`kumusta`, `salamat`, etc.).

3. **STOP / opt-out keyword support.** PH has no equivalent of the US DND
   registry for transactional SMS (per Sent's analysis of NTC regs)[^sent].
   International best practice is to support STOP/CANCEL/END keywords.
   Neither provider offers managed opt-out handling — both will deliver the
   inbound SMS to whatever webhook or inbox the clinic configures, but
   neither will auto-suppress future sends on its own. Does the clinic want
   STOP support? If yes, add an inbound route (`POST /api/sms/inbound`) and
   a `customers.sms_opt_out` flag, then thread it through the send path.
   For v1 with <100 bookings/week this is nice-to-have, not load-bearing.

4. **24h reminder window — what happens if the booking was rescheduled?**
   Per `docs/operator-answers.md` §11 reschedules are edit-in-place. The
   cron that fires the 24h reminder needs to re-check `bookings.start_at`
   inside the same minute it sends — otherwise a patient who reschedules
   for tomorrow gets a reminder for the original slot. Implementation note,
   not a vendor choice, but it should be confirmed before the cron card
   starts.

5. **Free-trial credits.** PhilSMS gives 5 free SMS credits on signup;
   Semaphore does not advertise a free tier but starts at ₱0.56/SMS with
   no minimum top-up. For the dev/staging cycle (the operator's two phone
   numbers, ~30 test SMS over the swarm's lifetime), either provider is
   trivially affordable. Confirm whether the operator wants to start with
   a paid top-up (Semaphore) or a free trial (PhilSMS) for the first
   integration sprint.

---

## Footnotes

[^philsms-docs]: PhilSMS Developer API Documentation.
    https://app.philsms.com/developers/documentation

[^philsms-home]: PhilSMS homepage. https://www.philsms.com/

[^philsms-sdk]: `jaydoesphp/philsms-php` Composer library (third-party).
    https://github.com/runemarcx/philsms-php/

[^sem-docs]: Semaphore API Documentation. https://www.semaphore.co/docs

[^sem-home]: Semaphore homepage. https://www.semaphore.co/

[^sem-composer]: `kickstartph/semaphore-client` Composer library.
    https://packagist.org/packages/kickstartph/semaphore-client

[^sem-py]: Community Python wrapper `semaphore-sms` (PyPI).
    https://pypi.org/project/semaphore-sms/

[^sem-faq]: Semaphore FAQ (Sender Names, message status, billing).
    https://semaphore.co/faq

[^sent]: "Philippines SMS API Pricing Comparison: Providers, Costs &
    Regulations (2025)" — Sent Resources. Mentions Semaphore ₱0.50 (ex-VAT)
    and PhilSMS starts-at-₱0.35 pricing, plus NTC + Data Privacy Act notes.
    https://www.sent.dm/en/resources/sms-pricing/philippines-sms-pricing

[^cf-fetch]: Cloudflare Workers Fetch API docs.
    https://developers.cloudflare.com/workers/runtime-apis/fetch/

[^cf-buffer]: Cloudflare Workers Buffer / nodejs_compat docs.
    https://developers.cloudflare.com/workers/runtime-apis/nodejs/buffer/