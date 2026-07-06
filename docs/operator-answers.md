# Operator Answers — Amelia MVC review open questions

Source: `docs/amelia-review.md` section 6.
Resolved: 2026-07-06.
Read by: future implementation swarm (Cloudflare + D1 + Worker + admin UI).

## 1. Deposit policy

**Pay deposit optional, not required.** Default is "pay on arrival" (no deposit). Some bookings may elect to pay a small PHP 500 hold via online gateway to lock the slot — the receptionist configures this per booking in v1.1, not at the service level in v1.

**Payment stack: PayMongo as v1 primary.** See `docs/payments-research.md` §3 for the comparison. Xendit is the v1.1 follow-up. Direct Maya and direct GCash are out for v1 (Maya requires a 2-4 week relationship-manager build; GCash direct is invitation-only). PayMongo covers both Maya and GCash at published MDRs without the operational overhead.

Implication for the schema:
- `bookings.deposit_status TEXT NULL` — `'none' | 'pending' | 'paid' | 'forfeited' | 'refunded'`
- `bookings.deposit_amount_centavos INTEGER NULL`
- `bookings.deposit_gateway TEXT NULL` — `'paymaya' | 'gcash' | 'paymongo' | 'xendit'`
- `bookings.deposit_reference TEXT NULL` — gateway-side reference for reconciliation
- New `payments` table to log gateway webhooks (id, booking_id, gateway, event_type, payload, created_at) — required for any PCI-adjacent compliance work and for the receptionist to verify payment landed.
- Webhook receiver endpoint: `POST /api/payments/webhook/:gateway` with HMAC signature verification per gateway.

## 2. Cancellation policy and lead time

**24-hour lead time, 24-hour cancellation window.** Standard dental default.

- `settings.min_lead_minutes = 1440` (24h ahead, no same-day booking via the public form)
- Patient may self-cancel via the token link in the confirmation email up to 24h before `start_at`. After that, the receptionist handles it.
- No-show fee (PHP 500) is a clinic-policy decision; not enforced in the booking system. Receptionist marks `no_show` and bills manually on the next visit.
- Email templates reflect this. Confirmation email says: "Need to reschedule? You can manage your appointment up to 24 hours before your visit using the link below. After that, please call us."

## 3. SMS reminder

**Yes, 24-hour reminder.**

- `notifications` template `booking_reminder_24h` fires at `start_at - 24h` for any booking with `status = 'approved'`.
- Implementation: a Cloudflare Worker Cron Trigger runs every 15 minutes, queries `bookings` where `status = 'approved'` and `start_at` is between 24h and 24h15m from now, sends a reminder SMS via the chosen provider, logs to `notifications`.
- One-time confirmation SMS at booking time remains (per `notifications` template `booking_pending_patient` / `booking_confirmed_patient`).
- 1-hour reminder is **out of scope** for v1. Add in v1.1 if clinic wants.

## 4. Walk-in support

**Feature kept, off by default for this clinic.** Implementation surface is built but `settings.walkins_enabled` defaults to `0` for the Lerio Dental deployment. Other clinics that license the system can flip the flag.

- Admin calendar gets a "Walk-in now" action when `walkins_enabled = 1`. The action:
  - Opens a quick-pick: provider, service, customer (existing or new).
  - Defaults `start_at = now()`, `end_at = now() + service.duration_minutes`.
  - Sets `bookings.source = 'walkin'`, status `approved`.
  - Skips the `min_lead_minutes` check.
  - Marks the slot as taken immediately in the public slot picker (which polls every 30s on the booking page).
- For Lerio Dental specifically: `walkins_enabled = 0`, the admin "Walk-in now" button is hidden, but the code path exists.

## 5. Chairs and rooms

**3 dentists, 3 chairs, 1 chair per dentist.** No shared equipment.

- The `resources` table stays out of v1. The model is: each provider has their own chair, `bookings.provider_id` is sufficient to imply the chair.
- If a clinic later adds a second chair for one dentist, add a `resources` table and a `booking.resource_id` FK. This is a backward-compatible migration.

## 6. Booking confirmation flow

**Manual approval by receptionist, no auto-confirm.** This is the primary defense against double-booking.

- Public POST `/api/bookings` always writes with `status = 'pending'`.
- Patient email goes out with subject "We received your appointment request" and a body that does NOT say "you're confirmed". It links to the token URL where the patient can see status.
- Clinic email goes out immediately to the receptionist's address with the booking details. The receptionist opens the admin calendar, sees the pending booking on the timeline, checks against any unrecorded phone reservations, clicks Approve.
- Status transitions:
  - `pending → approved` — sends "you're confirmed" email to patient, sends clinic confirmation.
  - `pending → rejected` — sends "we couldn't accommodate this time" email, optional reason.
  - `approved → completed` — receptionist marks after the visit.
  - `approved → no_show` — receptionist marks if patient didn't arrive.
  - `approved → canceled` — patient-initiated via token link, or receptionist on phone.
- `completed` is terminal. No re-opening without direct DB edit (which the audit log captures).

## 7. Compliance

**HIPAA-aligned practices even though PH has no equivalent.** This is a posture, not a certification. We're not pursuing formal HIPAA certification, but we hold ourselves to the same bar because the clinic may handle data of US expat patients and because the discipline is good engineering.

- **Encryption at rest**: D1 is encrypted at rest by Cloudflare. R2 is encrypted at rest. No additional step needed.
- **Encryption in transit**: Cloudflare Access + Workers enforce TLS 1.2+. No `http://` links anywhere in the system.
- **Access control**: Cloudflare Access gates `/admin/*`. Every admin request carries an `x-cf-access-authenticated-user-email` header. The Worker records this in `audit_log.actor_id` for every write.
- **PII minimization in logs**: Worker logs (Cloudflare Logpush or `console.log`) must redact `email`, `phone`, `patient_notes`, and `internal_notes` fields. Add a redaction layer to the Worker's logging path.
- **PII in error messages**: error responses to the client must never echo back PII. 400 responses return field names, not values.
- **Retention**:
  - `bookings`, `customers`, `notifications`, `audit_log` retained 7 years from `created_at` per dental record-retention norms.
  - Old records are archived (moved to `bookings_archive` etc.) not deleted, so the clinic can produce them on legal request. The archive is a Cloudflare R2 bucket holding NDJSON exports.
  - A Worker cron runs monthly, moves records older than 7 years to R2, deletes from D1.
- **Patient data export**: the `customers` row + all linked `bookings` + all linked `notifications` for that customer must be exportable as a single JSON document on request. Admin action: "Export patient record". This is the HIPAA right-of-access equivalent.
- **Patient data deletion on request**: receptionist can soft-delete a patient (sets `customers.deleted_at`), which anonymizes PII in the D1 row but preserves the `bookings` row's `customer_id` for record-retention purposes. The anonymized customer row is kept with `first_name='REDACTED'`, `last_name='REDACTED'`, `email='redacted+' || id || '@deleted.local'`, `phone=NULL`. (HIPAA right-to-erasure equivalent, but records are retained.)
- **Breach notification runbook**: documented in `docs/security-runbook.md` (created in the security card of the implementation swarm). Cloudflare's audit log + D1 access log + Worker request log are the source of truth.
- **BAA with Cloudflare**: Cloudflare offers a BAA addendum on its Enterprise plan. The clinic is on the free tier for v1; document the gap in the security runbook and flag it as a v1.1 ask when the clinic grows.

## 8. Calendar integration

**Both iCal attachment and Google Calendar push.**

- v1 ships **iCal attachment only**. Each confirmation email includes a `.ics` file the patient can tap to add to Apple/Google/Outlook. Source: `IcsApplicationService.php` in Amelia.
- v1.1 adds **Google Calendar push**: clinic's Google Calendar receives every new booking as an event, two-way busy-time sync (so when a dentist blocks off a slot in Google Calendar, the public slot picker reflects it).
  - Service account JSON key stored as a Cloudflare Worker secret (`GCAL_SERVICE_ACCOUNT_JSON`).
  - Calendar ID in `settings.clinic_calendar_url`.
  - Push via `calendar.events.insert` on every `pending → approved` transition AND on every new booking (status `pending` shows as tentative).
  - Watch channel for two-way sync via `calendar.events.watch` (long-lived, refresh every 7 days via cron).
- v1 does NOT include Outlook or Apple Calendar two-way sync.

## 9. Email domain

**`@leriodentalcenter.com`.**

- All transactional email goes out as `noreply@leriodentalcenter.com` (booking confirmations, status changes, reminders).
- The clinic's "Contact Us" form on the public site goes to `contact@leriodentalcenter.com` (receptionist's address).
- DNS work needed: SPF + DKIM records via Resend's domain verification flow. The receptionist or domain owner needs to add the records.
- The `clinic_calendar_url` setting in v1.1 will be a Google Calendar ID under the same Google Workspace domain (assumed `leriodentalcenter.com`).

## 10. Time-of-day preference

**Out of scope.** Patient picks the exact slot from the slot picker. The slot picker shows all available times for the chosen service+provider+date-range; the patient picks. No "I prefer mornings" filter.

- The slot picker UI is calendar-grid style: columns are days, rows are hours; available slots are clickable pills. Clicking a slot advances to the customer-info step.

## 11. Reschedule flow

**Edit-in-place is preferred.** When a patient calls to move, the receptionist edits `bookings.start_at` (and `end_at` derived), keeps `status` unchanged.

- `bookings.initial_start_at` and `bookings.initial_end_at` capture the original values for the audit trail.
- `bookings.reschedule_count INTEGER NOT NULL DEFAULT 0` increments on every reschedule.
- `audit_log` records both before and after on every reschedule.
- Email template `booking_rescheduled_patient` fires on every reschedule.
- Self-service reschedule via the token link is allowed up to 24h before `start_at` (same window as cancel). After that, the link shows "please call us to reschedule" and the receptionist handles it.
- Cancel-and-rebook is still possible: receptionist can cancel an existing booking and create a new one. The audit log captures both actions. This is the "from scratch" path; edit-in-place is the normal path.

## 12. Multi-language emails

**Bilingual templates per locale, single language per patient.** One email per patient per notification, in the patient's chosen language. No bilingual mixed emails.

- `customers.locale TEXT NOT NULL DEFAULT 'en'` — `'en' | 'fil'`. Set at first booking creation; receptionist can change later in admin.
- The `notifications.template` field is a key like `booking_pending_patient_en` or `booking_pending_patient_fil`. The Worker picks the right template variant based on `customer.locale`.
- v1 ships English and Filipino templates for every notification. Adding a third language later is purely a template-add operation, no code change.
- The admin UI is English-only in v1 (clinic staff are assumed English-comfortable).
- The public booking form is English-only in v1, with a language switcher stub that says "Filipino coming soon" if the user clicks it.

---

## Out of scope (locked decisions)

- WordPress, Decap CMS, TinaCMS — Cloudflare-native only.
- Twilio SMS — replaced by **Semaphore** (primary) and **PhilSMS** (documented fallback). See `docs/sms-research.md` §3.
- Online payments at booking time (the default flow) — pay on arrival; deposit is optional via PayMongo.
- Multi-location — single clinic.
- Packages, events, group bookings, recurring/sub-cycle bookings, custom fields, coupons, taxes, invoices, customer reviews, customer cabinet login, provider time-off requests, WhatsApp notifications, Zoom/Meet/Teams, Elementor/Gutenberg/Divi/BuddyBoss/WPDT, Mailchimp, provider mobile app, two-way Outlook/Apple calendar sync — all skipped.
- Auto-confirm of bookings — receptionist always approves manually.
- Time-of-day preference filter — patient picks exact slot.
- Refund support in v1 — receptionist handles manually; refunds inside the system deferred to v1.1.
- STOP / opt-out SMS handling — deferred to v1.1 (PH has no DND equivalent for transactional SMS).
- Direct Maya and direct GCash payment integration — out for v1; PayMongo already covers both at published MDRs.

## Locked implementation defaults (from research spikes, 2026-07-06)

- **Payment primary**: PayMongo. Xendit queued for v1.1 (`docs/payments-research.md` §3).
- **SMS primary**: Semaphore. PhilSMS as fallback (`docs/sms-research.md` §3).
- **SMS Sender Name**: `LERIO DNTL` (10 chars, within the 11-char cap of both providers).
- **Filipino templates**: ASCII-only (`kumusta`, `salamat`) — keeps every SMS single-segment, no UCS-2 billing penalty.
- **Multi-tenant from day 1**: `tenant_id` column on every table + a Worker check on every endpoint. Cheap insurance for future sister-clinic rollouts.

## Open questions still requiring answer

None. All 12 questions from the Amelia review are resolved.
