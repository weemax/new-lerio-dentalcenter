# Payment Gateway Research — Lerio Dental Center deposit flow

Research spike. Compares PayMaya (now Maya), GCash, PayMongo, and Xendit for the
optional PHP 500 deposit at booking time (per `docs/operator-answers.md` §1). This
is research only — no Worker handlers, no schema migrations are written here. The
implementation swarm consumes this.

Amelia has PHP service implementations for Stripe, PayPal, Mollie, Razorpay,
Square, and Barion (`ameliabooking/src/Infrastructure/Services/Payment/`). It has
**zero** PH-native gateway code — the migration is genuinely greenfield, not a
translation. The StripeService pattern (Basic-auth-or-secret-key, redirect-based
checkout, single `payments` row per webhook event, idempotent refund) maps cleanly
to all four candidates below.

---

## 1. Side-by-side comparison

Source URLs are inline in each cell. Operator-relevant dimensions only.

| Dimension | PayMongo | Xendit | Maya (was PayMaya) | GCash direct |
|---|---|---|---|---|
| **Auth model** | HTTP Basic: `sk_live_xxx` as username, blank password (`-u sk_live_xxx:`) ([auth reference](https://docs.paymongo.com/docs/fiaas-workflows-authentication)) | Secret API key in `Authorization: Basic <base64(secretkey:)>`, also supports API-key-as-bearer in header ([Xendit Payments API](https://docs.xendit.co/docs/how-payments-api-work)) | Basic auth with public API key as username, blank password ([PayMaya Direct API Reference](https://s3-us-west-2.amazonaws.com/developers.paymaya.com.pg/pay-by-paymaya/index.html)); Maya Checkout uses OAuth 2 client_credentials + secret key for confidential endpoints ([Maya API Environments](https://developers.maya.ph/reference/api-environments)) | Invitation-only; partner orgs receive credentials via the GCash API Portal after manual approval ([GCash API Portal FAQ](https://gcash.com/business/api-portal-faqs)) |
| **Checkout flow** | Hosted Checkout Session → redirect to `checkout.paymongo.com/cs_xxx` ([Hosted Checkout](https://docs.paymongo.com/docs/payment-channels-hosted-checkout)); `/v2` recommended | `POST /v3/payment_requests` returns an `actions[]` array with `REDIRECT_CUSTOMER` URL → redirect ([Xendit Payments API](https://docs.xendit.co/docs/how-payments-api-work)) | Maya Checkout hosted page (`https://payments.maya.ph` prod) or QR Ph / wallet-link ([Maya Checkout](https://developers.maya.ph/docs/maya-checkout)) | GCash-hosted page or redirect (post-onboarding; not researched beyond access model) |
| **Supported methods (PH)** | Cards (Visa/MC), **GCash**, **Maya**, GrabPay, ShopeePay/SPayLater, QR Ph, Direct Online Banking (BDO/UnionBank/BPI/Landbank/Metrobank), BillEase BNPL ([PayMongo Pricing](https://www.paymongo.com/pricing)) | 100+ across SEA; PH: GCash, Maya, GrabPay, Cards, Online Banking, OTC, QR, plus BillEase BNPL ([Xendit PH Integration](https://www.xendit.co/en-ph/products/integration/), [Xendit all payment methods](https://www.xendit.co/en/products/all-payment-methods/)) | Maya wallet (Login & Pay / Maya QRPh), cards (visa/mc), Maya-issued wallets/QR ([Maya Checkout](https://developers.maya.ph/docs/maya-checkout)) | GCash wallet only (the merchant-side is GCash itself, no method multiplexing) |
| **Webhooks** | `Paymongo-Signature` header — three comma-separated parts `t=…,te=<test sig>,li=<live sig>`; signature = `HMAC-SHA256(whsec, "<t>.<raw_body>")`, compare to `te` for test or `li` for live; replay window recommended ([Webhook Setup & Management](https://docs.paymongo.com/docs/developer-tools-webhook-setup-management)). Up to 12 retries per delivery, 3 consecutive failed events disables the webhook ([Webhook Resource](https://docs.paymongo.com/reference/webhook-resource)). Event for deposit flow: `checkout_session.payment.paid` ([Hosted Checkout](https://docs.paymongo.com/docs/payment-channels-hosted-checkout)) | Static `x-callback-token` header compared against a per-account token from Dashboard → Webhooks settings; not HMAC, constant-time compare still required ([Handling Webhooks](https://docs.xendit.co/docs/handling-webhooks)). 6 retries with exponential backoff ([Handling Webhooks](https://docs.xendit.co/docs/handling-webhooks)) | Old PayMaya Direct: `PAYMENT_SUCCESS | PAYMENT_FAILED | PAYMENT_EXPIRED`, no documented HMAC signature on the wallet-link API ([PayMaya Direct API Reference](https://s3-us-west-2.amazonaws.com/developers.paymaya.com.pg/pay-by-paymaya/index.html)). Maya Checkout: webhooks recommended via IP allowlist (sandbox `13.229.160.234, 3.1.199.75`; prod `18.138.50.235, 3.1.207.200`) ([Maya API Environments](https://developers.maya.ph/reference/api-environments)). The Maya PHP SDK exposes `paymaya.webhooks.verifyWebhook(request, secretKey)` ([paymaya-integration npm](https://www.npmjs.com/package/paymaya-integration)) — i.e. modern Maya Checkout does sign, but the docs page on the exact algorithm requires the Maya checkout reference behind auth | Not researched; only disclosed under partner NDA via the API Portal |
| **Fees (PH retail, PHP-only transactions, successful capture)** | Cards 3.125% + ₱13.39 (domestic) / 4.02% + ₱13.39 (intl); GCash 2.23%; Maya 1.79%; GrabPay 1.96%; QR Ph 1.34%; Direct Online Banking 0.71% or ₱13.39; BillEase BNPL 1.34%; ShopeePay 1.70% ([PayMongo Pricing](https://www.paymongo.com/pricing)) | **GCash 2.3%** flat (no fixed fee) ([Xendit GCash page](https://www.xendit.co/en/gcash-payment-method/)); cards ~3.2% + ₱10 per third-party reporting ([blog cite — flagged for verification](https://beglobalecommercecorp.com/the-ultimate-guide-to-shopify-payment-gateway-integration-steps-requirements-and-top-payment-methods/)); other methods advertised per-method on Xendit dashboard | Direct Maya merchant agreement; published rate card requires login ([Maya Merchant Manager](https://manager.paymaya.com/)). Public pricing not exposed without onboarding ([Maya Checkout](https://developers.maya.ph/docs/maya-checkout) — "contact your Maya Relationship Manager") | Not public; partner-only |
| **Settlement** | Standard 2–7 business days; Instant Settlement add-on up to 2% (QR/Bank) or 3% (Cards/BNPL) ([PayMongo Pricing](https://www.paymongo.com/pricing)) | T+1 to T+3 typical; varies by channel and merchant risk profile ([Xendit PH Integration](https://www.xendit.co/en-ph/products/integration/)) | "Settlement varies for each partner. For more details on the settlement, reach out to your Maya Relationship Manager" ([Maya Checkout](https://developers.maya.ph/docs/maya-checkout)) | Not published |
| **Refund mechanics** | `POST /v1/refunds` with `payment_id` and optional `amount` (centavos); webhooks `payment.refunded` and `payment.refund.updated` ([Webhook Resource](https://docs.paymongo.com/reference/webhook-resource)) | `POST /refunds` with idempotency-key support; cancel via `POST /refunds/{id}/cancel` ([Refund a payment request](https://docs.xendit.co/apidocs/refund-payment-request)) | "Transactions created can be voided or refunded following certain conditions... Via Manager or API. To enable this functionality reach out to your Maya Relationship Manager" ([Maya Checkout](https://developers.maya.ph/docs/maya-checkout)) | Not researched; via GCash Manager dashboard |
| **PH licensing / regulatory** | BSP-registered EMI/operator (PayMongo Payments Inc.); PCI-DSS Level 1 | Xendit Philippines Inc and XenRemit, Inc supervised by BSP ([Xendit footer](https://www.xendit.co/en/products/all-payment-methods/)) | Maya Bank Inc is a digital bank (BSP-licensed thrift/rural bank after 2022 rebrand; deposit-taking + payment facilitator via Voyager/Innovations); PCI-DSS compliant | GCash is operated by Mynt/Globe Fintech Innovations Inc, BSP-licensed EMI |
| **Cloudflare Workers compatibility** | All HTTP via `fetch`; secret key in `secret` binding (`PAYMONGO_SECRET_KEY`); webhook signature via `crypto.subtle.sign("HMAC", key, enc.encode(t + "." + rawBody))` — same primitive used in the official CF Worker example ([CF Workers sign requests](https://developers.cloudflare.com/workers/examples/signing-requests/), [CF Workers Web Crypto](https://developers.cloudflare.com/workers/runtime-apis/web-crypto/)) | `fetch` only; webhook token is a static string compare — use constant-time via `crypto.subtle.timingSafeEqual`-equivalent (textual string compare via `crypto.subtle.digest("SHA-256", a) === ...` if needed) | Public-key Basic auth → fetchable. Maya Checkout confidential endpoints need a server-side secret stored as Worker secret | Same constraints; signing scheme not public |
| **Free tier / onboarding cost** | No setup fee, no monthly fee — pay-as-you-go on the per-method MDR above ([PayMongo Pricing](https://www.paymongo.com/pricing)); sign-up at `dashboard.paymongo.com/signup` | No setup, no monthly, no minimum ([Xendit GCash page](https://www.xendit.co/en/gcash-payment-method/)); sign-up at `dashboard.xendit.co/register/1` | Onboarding is 1-week merchant-acct → 2–4 weeks build → 2–3 days UAT, then go-live ([Maya Checkout](https://developers.maya.ph/docs/maya-checkout)). Free to integrate, no published fee schedule | Enterprise invitation; contact GCash account manager |

### Quick read

- **PayMongo** has the highest PH-method coverage at the lowest engineering cost per
  integration (single API, single HMAC signature). Trade-off: card fees are the
  highest in PH (3.125% + ₱13.39 domestic). For deposits the clinic will likely
  funnel patients to GCash/Maya (1.79–2.23%), so the card rate rarely matters for
  a PHP-500 deposit.
- **Xendit** matches PayMongo on PH methods, has a simpler webhook signature
  (static token), and is BSP-supervised. Card fees per third-party reporting
  (3.2% + ₱10) are ~similar to PayMongo. Volumes over PHP 10M/mo require a
  custom contract ([Xendit GCash page](https://www.xendit.co/en/gcash-payment-method/)).
- **Maya direct** (formerly PayMaya): exposed as a standalone wallet gateway for
  merchants who specifically want only Maya users (no GCash, no cards). Onboarding
  is multi-week. Modern Maya Checkout is the modern surface (`developers.maya.ph`)
  — functionally identical to a hosted PayMongo-style checkout but for one channel.
- **GCash direct**: invite-only / partner-only. Not practically reachable by a
  single dental clinic without an existing GCash relationship. The clinic almost
  certainly does not have this.

---

## 2. Per-gateway deep dive

### 2.1 PayMongo

**Recommended integration:** Hosted Checkout via `POST /v2/checkout_sessions`. v2
defers Payment Intent creation until the customer picks a method, which unlocks
`pass_on_fees` (you can itemize the gateway fee onto the customer if a 500 PHP
deposit ever falls to a low margin) ([Hosted Checkout](https://docs.paymongo.com/docs/payment-channels-hosted-checkout)).
v1 (`/v1/checkout_sessions`) is fine but doesn't support `pass_on_fees`; the v1 → v2
move is a one-curl swap on the receptionist endpoint.

**Auth flow:** Two secret-key flavors per environment. Test and live live as
`sk_test_…` and `sk_live_…`. Surface them as **Worker secrets only** — not in env
vars injected into client builds. The browser never sees the secret. Public keys
(`pk_…`) exist for client-side token creation if we ever go inline; we shouldn't
for this flow because we're server-side creating the link from
`POST /api/payments/create`.

**Webhook signature:** Exact algorithm ([Webhook Setup & Management](https://docs.paymongo.com/docs/developer-tools-webhook-setup-management)):

```
Paymongo-Signature: t=1496734173,te=<hex>,li=<hex>
string_to_sign = "<t>.<raw_body>"
signature = hex(HMAC-SHA256(whsec_secret, string_to_sign))
compare to te for livemode=false, li for livemode=true
```

**Idempotency:** Not documented on the host object as a single header — but the
clinic-side dedupe is via `bookings.deposit_reference` (gateway checkout-session id
or payment id) plus the partial UNIQUE index suggested in §4 below.

**TypeScript sketch (Cloudflare Worker, illustrative only):**

```ts
// POST /api/payments/create
const session = await fetch("https://api.paymongo.com/v2/checkout_sessions", {
  method: "POST",
  headers: {
    "Authorization": "Basic " + btoa(env.PAYMONGO_SECRET_KEY + ":"),
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    data: {
      attributes: {
        line_items: [{
          name: "Lerio Dental deposit",
          amount: 50000,        // PHP 500.00 in centavos
          currency: "PHP",
          quantity: 1,
        }],
        payment_method_types: ["gcash", "paymaya", "card", "qrph"],
        success_url: `https://leriodentalcenter.com/booking/${booking.public_token}/paid`,
        cancel_url:  `https://leriodentalcenter.com/booking/${booking.public_token}`,
        reference_number: `booking-${booking.id}`,
        metadata: { booking_id: booking.id, public_token: booking.public_token },
      }
    }
  })
}).then(r => r.json());
// Log session.data.id + amount, then INSERT payments row and return checkout_url
```

**Known gotchas:**

- Currency is PHP-only at the moment (per [Checkout Session Resource](https://docs.paymongo.com/reference/checkout-session-resource)). Fine for this clinic.
- Amount field is in centavos, integer. PHP-side `decimal(10,2)` is fine if you multiply by 100 at the edge — do not round-trip through `Number` in JS. Persist as `INTEGER` centavos (the locked operator-answers column is `deposit_amount_centavos INTEGER NULL` — already cents-aligned).
- Card payments get a 13.39 PHP fixed fee per charge. For a PHP 500 deposit that's 2.7% load on top of the 3.125% — totally negligible, but document it so the receptionist isn't surprised at the per-transaction deduction.
- Webhook retries up to 12×, with the webhook auto-disabling after 3 consecutive failed batches. The Worker must return `2xx` inside ~10s with `ctx.waitUntil(...)` doing any slow work.

### 2.2 Xendit

**Recommended integration:** `POST /v3/payment_requests` with `country=PH`,
`currency=PHP`, `channel_code=GCASH` (or `MAYA`, `GRABPAY`, etc.), and
`channel_properties.success_return_url` / `failure_return_url`. The response
contains an `actions[]` with a `REDIRECT_CUSTOMER` URL — host-redirect flow.
Reuse the same handler that serves `POST /api/payments/create`: swap the body
shape but keep the slot-free check, the `payments` row insert, and the response
shape identical ([Xendit Payments API](https://docs.xendit.co/docs/how-payments-api-work)).

**Auth flow:** Production secret key per Xendit account, surfaced as a Worker
secret. Authorization header is `Basic <base64(secretkey:)>` or bearer
header-style in their PHP SDK. The simplest is Basic. The same Worker secret
covers both payment creation and refunds.

**Webhook signature:** `x-callback-token` header against the per-account token
set in Dashboard → Webhooks settings ([Handling Webhooks](https://docs.xendit.co/docs/handling-webhooks)).
No HMAC, but use `crypto.subtle.timingSafeEqual` semantics (digest-equal is the
closest Workers primitive). 6 retries on failure with exponential backoff.

**Idempotency:** Xendit supports `Idempotency-Key` header on payment
creation/refund requests; this is the right hook for safe receptionist double-clicks.
Always set `X-Idempotency-Key: <booking_id>-<attempt>` on the create-call.

**TypeScript sketch:**

```ts
// POST /api/payments/create
const payment = await fetch("https://api.xendit.co/v3/payment_requests", {
  method: "POST",
  headers: {
    "Authorization": "Basic " + btoa(env.XENDIT_SECRET_KEY + ":"),
    "Idempotency-Key": `booking-${booking.id}-1`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    reference_id: `booking-${booking.id}`,
    type: "PAY",
    country: "PH",
    currency: "PHP",
    request_amount: 500.00,    // Xendit takes decimal-amount (not centavos)
    capture_method: "AUTOMATIC",
    channel_code: "GCASH",
    channel_properties: {
      success_return_url: `https://leriodentalcenter.com/booking/${booking.public_token}/paid`,
      failure_return_url: `https://leriodentalcenter.com/booking/${booking.public_token}`,
    },
    description: "Lerio Dental deposit",
    metadata: { booking_id: booking.id },
  })
}).then(r => r.json());
// Save payment_request_id; return the REDIRECT_CUSTOMER url.
```

**Known gotchas:**

- **Cents vs decimal:** PayMongo uses centavos (integers). Xendit's
  `request_amount` is a decimal string in PHP (e.g. `"500.00"`). Important
  enough to spike-test both gates on the same amount before shipping.
- Webhook sequence: not guaranteed. The docs explicitly warn
  "do not expect any fixed sequence with webhooks" — build idempotency on
  Xendit's server-side `payment_id` rather than rely on order.
- For GCash and Maya channels, the customer is redirected to Xendit's hosted
  page (`xendit.co/example` in the sample), not the wallet app directly — important
  for the patient UX rewrite (mention "you'll be redirected to our payment page" in
  the email).
- BSP supervision: "Xendit Philippines Inc. and XenRemit, Inc are supervised and
  regulated by the Bangko Sentral ng Pilipinas" ([Xendit footer](https://www.xendit.co/en/products/all-payment-methods/)) — this is a positive for compliance reputation.

### 2.3 Maya (formerly PayMaya)

**Two distinct surfaces to know about:**

1. **Maya Checkout** (`developers.maya.ph`) — the modern, hosted-checkout gateway.
   Confluence of cards + Maya wallet + QRPh + e-wallets listed in the catalogue.
   Sandbox at `https://pg-sandbox.paymaya.com`, production at `https://pg.maya.ph`
   ([Maya API Environments](https://developers.maya.ph/reference/api-environments)).
2. **PayMaya Direct API** (the legacy wallet-link API at
   `s3-us-west-2.amazonaws.com/developers.paymaya.com.pg/pay-by-paymaya/index.html`) —
   the wallet-link-to-PayMaya-account surface only. This is what "PayMaya" usually
   refers to in older docs.

For this project we want Maya Checkout, surface 1.

**Recommended integration:** `POST https://pg.maya.ph/checkout/v1/checkouts` (this
endpoint name is what the legacy reference exposed; the Maya Checkout docs page
funnels to a confidential reference behind auth, so we are working from the public
landing pages and the npm SDK). Use Basic auth with the merchant's *public* key for
checkout creation, and the *secret* key for retrievals/refunds/webhook registration
(per the npm `paymaya-integration` SDK and the legacy reference).

**Auth flow:** OAuth 2 `client_credentials` for getting a short-lived access
token in some sub-flows; or Basic auth with `pk-…` / `sk-…` keys per the legacy
PayMaya reference. The actual Maya Checkout confidential reference is gated —
a real integration will require the relationship manager to send through the
docs. Plan for that relationship manager conversation as part of onboarding.

**Webhook signature:** The Maya ecosystem splits here:
- The legacy PayMaya wallet-link API has no documented HMAC signing in the
  public reference; security relies on the IP allowlist Maya provides
  ([Maya API Environments](https://developers.maya.ph/reference/api-environments)).
- `paymaya-integration` exposes `paymaya.webhooks.verifyWebhook(request, secretKey)`
  ([paymaya-integration npm](https://www.npmjs.com/package/paymaya-integration)), so
  modern Maya Checkout does sign — the algorithm behind it sits inside the
  gated reference.

Concretely: implementers should (a) whitelist the Maya IP ranges at the Worker
edge via Cloudflare WAF rules, and (b) HMAC-verify the signature once the
gated reference is available. Without the gated docs the surface is "treat
the webhook secret as a Worker secret, verify against the header, log and reject
on mismatch".

**TypeScript sketch (illustrative, gated-reference verification):**

```ts
// Maya hosted checkout session — surface may shift; treat as a starting point.
const checkout = await fetch("https://pg.maya.ph/checkout/v1/checkouts", {
  method: "POST",
  headers: {
    "Authorization": "Basic " + btoa(env.MAYA_PUBLIC_KEY + ":"),
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    totalAmount: { value: 500.00, currency: "PHP" },
    buyer: { firstName: customer.first_name, lastName: customer.last_name,
             email: customer.email, contact: customer.phone },
    items: [{ name: "Lerio Dental deposit", amount: { value: 500.00, currency: "PHP" }, totalAmount: { value: 500.00, currency: "PHP" } }],
    redirectUrl: {
      success: `https://leriodentalcenter.com/booking/${booking.public_token}/paid`,
      failure: `https://leriodentalcenter.com/booking/${booking.public_token}`,
      cancel:  `https://leriodentalcenter.com/booking/${booking.public_token}`,
    },
    requestReferenceNumber: `booking-${booking.id}`,
  })
}).then(r => r.json());
// Response carries { id, redirectUrl }.
```

**Known gotchas:**

- **Renamed product.** "PayMaya" is the pre-2022 brand; Maya is the post-rebrand
  product. The operator's list contains the older name. Recommendation: treat
  the clinic as integrating Maya, and credit them with the historical name
  for context.
- **Onboarding is 1-week merchant account + 2–4 weeks build + 2–3 days UAT**
  ([Maya Checkout](https://developers.maya.ph/docs/maya-checkout)). That is
  significantly slower than PayMongo or Xendit. Worth doing only if Maya is the
  clinic's brand preference.
- **Pricing is quote-only** — the docs punt the rate card to the relationship
  manager. The clinic will not be able to model fee deduction without a
  conversation.
- **Settlement is partner-specific** — same punt to the relationship manager.

### 2.4 GCash direct

**Access model:** Invitation-only portal. "GCash API Portal is currently only
available for selected partner organizations, please reach out to any of our
GCash account managers to get more information on the onboarding process"
([GCash API Portal FAQ](https://gcash.com/business/api-portal-faqs)).

**Why this matters for the recommendation:** A single dental clinic has no
realistic path to land a GCash direct partner relationship on the v1 timeline.
The two gateways that *expose* GCash to merchants (PayMongo and Xendit) each have
explicit GCash channels at published MDRs (PayMongo 2.23%; Xendit 2.3%) — so the
patient experience is identical whether the clinic uses GCash direct or
GCash-via-PayMongo, but only the gateway route is reachable.

**Deep dive is intentionally short:** the implementation swarm should not
spend time integrating the direct route in v1. Drop it from scope. If the
operator has an existing GCash relationship (none signalled in
`operator-answers.md`), the v1.1 swarm can re-evaluate.

---

## 3. Recommendation

**Pick PayMongo as the v1 primary.**

Rationale, in order of weight:
1. Single API covers every PH payment method the clinic could want for a
   deposit — GCash (2.23%), Maya (1.79%), GrabPay (1.96%), QR Ph (1.34%),
   cards (3.125% + ₱13.39), even BillEase BNPL if the clinic wants to offer
   installments later ([PayMongo Pricing](https://www.paymongo.com/pricing)).
   That is the same method coverage as Xendit, behind one HMAC-signed webhook.
2. The webhook signature algorithm
   ([Webhook Setup & Management](https://docs.paymongo.com/docs/developer-tools-webhook-setup-management))
   is the same shape Stripe uses — `HMAC-SHA256(secret, "<t>.<raw_body>")` —
   so the Worker code is reusable later if Stripe comes up.
3. Onboarding is self-serve at `dashboard.paymongo.com/signup` with no setup
   fee and a free tier — receptionist can create the merchant account during
   the implementation sprint without negotiating.
4. PCI-DSS scope is minimal: checkout is hosted, the Worker never sees a card.

Xendit is a strong second — same method coverage, simpler
`x-callback-token`-style webhook, BSP-supervised. If the clinic later wants
Xendit's payout or XenPlatform features for cross-clinic deployments, the
v1.1 swarm should add it (one card: "add Xendit as a second gateway"). The
Worker pattern is identical to PayMongo at the edge — the `payments` table
and webhook receiver don't change.

**Path to other three:**
- **Add Xendit (v1.1, ~1 week).** Same `payments` table, new `POST /api/payments/create` branch with a `gateway` selector; new HMAC verification branch in the webhook receiver.
- **Add Maya (v1.2, ~3–4 weeks).** PayMongo/Xendit already give Maya access (at
  1.79% via PayMongo). A direct Maya integration is worth it only if the clinic
  has a strong brand-affinity reason and can absorb the 2–4-week build timeline.
- **Skip GCash direct.** Invitation-only access model makes it impractical for
  this clinic. The two gateways above already cover GCash at published rates.

---

## 4. D1 schema delta

Delta against `docs/amelia-review.md` §3.7's `bookings` table and the payment
contract in `docs/operator-answers.md` §1.

### 4.1 Changes to `bookings`

Add four columns to the existing table. These match the locked fields in
operator-answers.md §1 verbatim. D1 advisory: no FK enforcement; the Worker
must validate before write.

```sql
-- Append to CREATE TABLE bookings … in docs/amelia-review.md §3.7.
ALTER TABLE bookings ADD COLUMN deposit_status        TEXT NULL;
ALTER TABLE bookings ADD COLUMN deposit_amount_centavos INTEGER NULL;
ALTER TABLE bookings ADD COLUMN deposit_gateway       TEXT NULL;
ALTER TABLE bookings ADD COLUMN deposit_reference     TEXT NULL;

-- CHECK constraint aligned with operator-answers.md §1.
-- (Recreate the table D1 doesn't enforce CHECK on ALTER; or skip the CHECK
-- and validate in the Worker.)
-- CHECK (deposit_status IS NULL OR deposit_status IN ('none','pending','paid','forfeited','refunded'))
-- CHECK (deposit_gateway IS NULL OR deposit_gateway IN ('paymaya','gcash','paymongo','xendit'))

-- Index for the receptionist view "show me bookings with a pending deposit".
CREATE INDEX idx_bookings_deposit_status
  ON bookings (deposit_status, start_at)
  WHERE deposit_status IS NOT NULL;

CREATE INDEX idx_bookings_deposit_reference
  ON bookings (deposit_reference)
  WHERE deposit_reference IS NOT NULL;
```

### 4.2 New `payments` table

One row per *gateway-visible event*. The `gateway_event_id` is the natural
idempotency key — a `UNIQUE (gateway, gateway_event_id)` makes a duplicate
webhook delivery a no-op (the Worker INSERTs-and-catches, or pre-checks).

```sql
CREATE TABLE payments (
  id                    INTEGER PRIMARY KEY,
  booking_id            INTEGER NOT NULL,
  gateway               TEXT NOT NULL,
  gateway_event_type    TEXT NOT NULL,        -- 'checkout_session.payment.paid', 'payment.paid', 'PAYMENT_SUCCESS', …
  gateway_event_id      TEXT NOT NULL,        -- PayMongo event id, Xendit payment_request_id, Maya txn id, …
  gateway_object_id     TEXT NULL,            -- session id, payment_id, refund_id — depends on gateway
  amount_centavos       INTEGER NOT NULL,     -- canonical store: centavos. ALWAYS.
  currency              TEXT NOT NULL DEFAULT 'PHP',
  status                TEXT NOT NULL,        -- 'pending'|'paid'|'failed'|'expired'|'refunded'|'voided'
  raw_payload           TEXT NOT NULL,        -- verbatim JSON from the webhook (for audit)
  signature_verified    INTEGER NOT NULL DEFAULT 0,  -- boolean — 1 if HMAC/token compared ok
  signature_header      TEXT NULL,            -- the literal header that was verified (PayMongo only)
  created_at            TEXT NOT NULL,
  updated_at            TEXT NOT NULL,
  CHECK (gateway IN ('paymaya','gcash','paymongo','xendit')),
  CHECK (status IN ('pending','paid','failed','expired','refunded','voided')),
  CHECK (currency = 'PHP'),
  CHECK (signature_verified IN (0,1))
);

CREATE UNIQUE INDEX idx_payments_idempotency
  ON payments (gateway, gateway_event_id);

CREATE INDEX idx_payments_booking ON payments (booking_id);
CREATE INDEX idx_payments_status_created ON payments (status, created_at);
```

### 4.3 A migration ledger

Append to `audit_log` with `entity='payments'` for every webhook delivery
(whether the gate's signature check passed or failed). The receptionist
dashboard can then surface "3 webhook deliveries, all valid, payment marked
paid by PayMongo event `evt_…`" without paging the raw payload.

### 4.4 Notes on what is *not* here

- **No `customers.payment_methods` table.** No saved cards or wallet tokens for
  v1. Each booking generates a fresh deposit link. Add in v1.1+ if recurring
  patients complain.
- **No full refunds table.** PayMongo and Xendit each have their own refund
  resource; we record a *second* payment row with `status='refunded'` and
  `amount_centavos` negative-ish (or track separately; this spike does not
  prescribe). The receptionist UI in v1 only ever kicks off a refund via
  `POST /api/payments/:id/refund` and reads the result row back.
- **No `currency` per booking.** Operator answers lock PHP. The CHECK constraint
  bakes that in.

---

## 5. Worker endpoint surface

All four endpoints live on the same Worker (`lerio-workers`, deployed via
`wrangler deploy` and fronted by `api.leriodentalcenter.com`). Auth: Cloudflare
Access for `/admin/*`; webhook endpoints are public but HMAC-verified.

### 5.1 `POST /api/payments/create`

Kicks off a deposit link for a booking. Receptionist-triggered; no public
booking form interaction.

**Request shape:**
```json
{
  "booking_id": 42,
  "gateway": "paymongo",          // or "xendit" | "paymaya" (post-onboarding) | "gcash" (post-onboarding)
  "channel": "gcash",             // gateway-specific method (paymongo: "gcash"|"paymaya"|"card"|...; xendit: "GCASH"|...)
  "amount_centavos": 50000        // server *validates* against the booking's configured amount; receptionist cannot override
}
```

**Response shape (success):**
```json
{ "checkout_url": "https://checkout.paymongo.com/cs_…", "payment_id": 17 }
```

**Auth model:** Cloudflare Access (receptionist session); `x-cf-access-authenticated-user-email`
header records actor for `audit_log`.

**Rate limit:** 30/min per receptionist (more than the deposit volume the
clinic will ever generate; protects against UI double-click storms).

**Error model:**
- `404 booking_not_found`
- `409 booking_not_pending` (already canceled / completed / no-show / already-paid)
- `422 invalid_amount` (booking has no deposit configured, or receptionist tried to override)
- `502 gateway_error` (PayMongo/Xendit returned a non-2xx; raw upstream error in `audit_log` only — never echoed back)

### 5.2 `POST /api/payments/webhook/:gateway`

`:gateway` is one of `paymongo | xendit | paymaya | gcash`. Public endpoint,
no Cloudflare Access — verifications happen in the handler:

- For `paymongo`: HMAC-SHA256 verify against `whsec_…`, compare to `te` or `li`
  per `livemode`. Worker enforces replay window (timestamp drift >5 minutes → reject).
  No Cloudflare Access, but the Worker IP-allowlists with Cloudflare WAF rules.
- For `xendit`: constant-time compare of `x-callback-token` against the per-account
  token. WAF rule pinning the Xendit outbound IP ranges is a defense-in-depth.
- For `paymaya` (Maya Checkout, v1.2): IP-allowlist via WAF against Maya's published
  IP ranges + HMAC verify once the gated reference is available.
- For `gcash` (v1.x, only if direct is ever opened): same pattern as Maya.

**Handler shape (illustrative, not for shipping):**
1. Read raw body (`request.text()` once — never parse twice; the signature is
   over the raw bytes).
2. Read signature header(s).
3. Compare signature with constant-time semantics.
4. On mismatch: 401, append to `audit_log` (with the *first 200 bytes* of the
   payload only — redaction per `operator-answers.md` §7).
5. On match: parse payload, extract `gateway_event_id`, attempt INSERT into
   `payments` with `signature_verified=1`.
6. If INSERT throws unique-violation → duplicate webhook, return 200 with
   `{"ok": "duplicate"}`.
7. Update `bookings.deposit_status`, `deposit_gateway`, `deposit_reference`,
   `deposit_amount_centavos` based on event type.
8. Return 200 inside 1s; slow work (email, audit logging) goes to `ctx.waitUntil`.

**Response shape:** `{ "received": true }` always for a verified delivery
(even if downstream D1 work fails — the Worker queued the slow stuff).

### 5.3 `GET /api/payments/:id`

Receptionist reads payment status.

**Response shape:**
```json
{
  "id": 17,
  "booking_id": 42,
  "gateway": "paymongo",
  "status": "paid",
  "amount_centavos": 50000,
  "currency": "PHP",
  "gateway_object_id": "cs_…",
  "created_at": "2026-07-07T09:21:00Z",
  "updated_at": "2026-07-07T09:23:14Z"
}
```

**Auth model:** Cloudflare Access, receptionist. Returns summary of the most
recent state of the *payment* — not the raw webhook payload (that's in
`audit_log`).

**Error model:** `404 payment_not_found`, `403 not_your_booking` (receptionist
not associated with the booking's provider — future multi-clinic concern).

### 5.4 `POST /api/payments/:id/refund` *(optional, v1)*

Kicks off a refund at the gateway. Defers the actual `POST /v1/refunds` (PayMongo)
or `POST /refunds` (Xendit) call to the Worker.

**Request shape:**
```json
{ "amount_centavos": 50000, "reason": "patient_canceled" }
```

**Auth model:** Cloudflare Access, receptionist; refund reason required.

**Response shape:** `{ "refund_id": "rd_…", "status": "pending" }`

**Error model:**
- `404 payment_not_found`
- `409 already_refunded` (idempotent)
- `403 not_paid_yet` (can't refund a `pending` payment)
- `502 gateway_error`

**Idempotency:** Set `Idempotency-Key: refund-payment-{id}-{attempt}` header
on the upstream gateway call.

### 5.5 What is *not* in v1

- No public-facing `POST /api/bookings/:id/pay` from the patient form. The
  receptionist always generates the link on behalf of the patient — this avoids
  exposing the secret-bearing Worker to public-traffic timing patterns. The
  receptionist emails the link via the existing `notifications` pipe.
- No webhook unsubscribe / re-subscribe via API. Webhooks are managed via the
  PayMongo/Xendit dashboard for v1. v1.1 automates this if multi-gateway rollout
  becomes operationally annoying.

---

## 6. Open questions for the operator

The implementation swarm blocks on these. Listed by impact.

1. **Which payment methods does the clinic actually accept on day one?**
   PayMongo's hosted page lets the patient pick. If the clinic wants *only* GCash
   and Maya (the two dominant PH e-wallets), the integration is one
   `payment_method_types: ["gcash", "paymaya"]` line. If they want cards too, no
   extra code, just admit them to the page. Knowing the answer up front means
   we don't have to write a `settings.accepted_methods` array v1 — we hardcode
   the accepted list at Worker build time and add a settings row in v1.1 if the
   clinic later wants to flip bits.
2. **Do they need refund support in v1?** If a patient cancels inside the
   24-hour window, the operator's policy is to call — manual. So a refund flow
   inside the system is not strictly required on day one. If v1 must support it,
   §5.4 is in scope; if not, it slips to v1.1 with the no-new-code impact limited
   to adding the endpoint.
3. **Settlement bank preference?** All four gateways settle into the clinic's
   enrolled bank account (BDO/UnionBank/etc.); the difference is which
   bank-account-detail bundle the clinic prefers to register with. Settle this
   once during onboarding. No code impact, but blocks the merchant account
   creation itself.
4. **Are installment plans (BillEase) worth activating?** PayMongo's BillEase
   channel runs at 1.34% ([PayMongo Pricing](https://www.paymongo.com/pricing))
   and could let patients split a PHP 5k+ treatment into 3/6/12 months. The
   deposit flow is small enough to ignore this. v1.1 should add it if the clinic
   wants to push high-ticket procedures.
5. **Maya (was PayMaya) as a direct integration?** The clinic patient base
   skews Maya-heavy in the Philippines, but PayMongo's `payment_method_types` line
   includes Maya at 1.79% with no extra code. A direct Maya Checkout integration
   is materially more work (see §2.3) and only worth it if the clinic has a brand
   partnership reason. Recommendation: skip for v1 and v1.1.
6. **Multi-clinic / multi-merchant?** The `payments` row ties to a `booking_id`
   only. If the same Worker and D1 will eventually be used by sister clinics
   (likely), the row needs a `tenant_id` and every endpoint needs the tenancy
   guard. Day-one cost is one extra column + one extra Worker check. Would rather
   add it now than refactor later — **answer needed.**
7. **BNPL for deposits?** BillEase typically isn't used on PHP 500 deposits.
   Confirm so we don't enable it speculatively (Pays a 1.34% fee on a transaction
   that doesn't need installments.)

---

## 7. Sources (canonical docs only; no blog spam)

- PayMongo Hosted Checkout: <https://docs.paymongo.com/docs/payment-channels-hosted-checkout>
- PayMongo Checkout Session resource: <https://docs.paymongo.com/reference/checkout-session-resource>
- PayMongo webhook resource: <https://docs.paymongo.com/reference/webhook-resource>
- PayMongo webhook setup & signature algorithm: <https://docs.paymongo.com/docs/developer-tools-webhook-setup-management>
- PayMongo API keys / authentication: <https://docs.paymongo.com/docs/account-settings-api-keys>
- PayMongo Pricing: <https://www.paymongo.com/pricing>
- Xendit Payments API (v3/payment_requests): <https://docs.xendit.co/docs/how-payments-api-work>
- Xendit Handling webhooks (x-callback-token): <https://docs.xendit.co/docs/handling-webhooks>
- Xendit Integration products: <https://www.xendit.co/en-ph/products/integration/>
- Xendit All payment methods: <https://www.xendit.co/en/products/all-payment-methods/>
- Xendit GCash method page (2.3%): <https://www.xendit.co/en/gcash-payment-method/>
- Xendit refund API: <https://docs.xendit.co/apidocs/refund-payment-request>
- Maya Developer Hub: <https://developers.maya.ph/>
- Maya API Environments (domains, IPs, OAuth): <https://developers.maya.ph/reference/api-environments>
- Maya Checkout product page: <https://developers.maya.ph/docs/maya-checkout>
- Pay-with-Maya (wallet/QRPh/login-and-pay): <https://developers.maya.ph/docs/pay-with-maya>
- PayMaya Direct API reference (legacy wallet API): <https://s3-us-west-2.amazonaws.com/developers.paymaya.com.pg/pay-by-paymaya/index.html>
- paymaya-integration npm SDK signature verification: <https://www.npmjs.com/package/paymaya-integration>
- GCash API Portal FAQ (invitation-only access): <https://gcash.com/business/api-portal-faqs>
- Cloudflare Workers Web Crypto: <https://developers.cloudflare.com/workers/runtime-apis/web-crypto/>
- Cloudflare Workers HMAC sign example: <https://developers.cloudflare.com/workers/examples/signing-requests/>
- Amelia review (existing `bookings` schema baseline): <https://docs/amelia-review.md> §3.7
- Operator answers (deposit policy + locked column list): <https://docs/operator-answers.md> §1
