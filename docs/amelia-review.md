# Amelia 9.6.2 — Review and Minimum-Viable-Clinic Port Plan

Reference study for porting a booking system off the Amelia WordPress plugin
onto a Cloudflare-native stack (Pages + Workers + D1 + R2 + Cloudflare Access).

Scope: read the Amelia 9.6.2 source under
`/Users/izzy/Projects/WebWolf/newleriodentalcenter/ameliabooking/`, enumerate its
feature surface, propose the smallest subset that lets a single-location dental
clinic in Dumaguete City actually run its booking workflow, and design a D1
schema concrete enough that an implementation swarm can start writing migrations
without re-deriving anything.

No code, no migrations, no worker logic. This is a reference study.

Source of truth: `ameliabooking.php` declares `AMELIA_VERSION = '9.6.2'`. The
`src/Domain/`, `src/Application/`, `src/Infrastructure/` PHP tree is what we
read. `v3/` and `redesign/` contain the customer-cabinet front-end assets only
(no PHP domain logic). `vendor/` is ignored.

---

## 1. Amelia's feature inventory

Amelia's public surface is large — roughly 60 distinct features grouped below.
Complexity estimates are relative to a Cloudflare Workers + D1 implementation
(no PHP, no WordPress, no Apache). "Small" = one Worker endpoint and one D1
table or table-modifier; "Medium" = one or two endpoints and a join table or
cron; "Large" = multi-endpoint, multi-table feature with non-trivial state
machines or third-party SDKs.

### Core booking

| Feature | Source | Complexity |
|---|---|---|
| Appointments (1:1 booking, a service + provider + time slot) | `src/Domain/Entity/Booking/Appointment/Appointment.php` | Small |
| Services (a bookable offering with duration, price, capacity) | `src/Domain/Entity/Bookable/Service/Service.php`, `AbstractBookable.php` | Small |
| Customers (the booker; may be guest or registered) | `src/Domain/Entity/User/Customer.php` | Small |
| Providers (employees who deliver the service) | `src/Domain/Entity/User/Provider.php` | Small |
| Booking status state machine (`approved`, `pending`, `canceled`, `rejected`, `no-show`, `waiting`) | `src/Domain/ValueObjects/String/BookingStatus.php` | Small |
| Internal notes per booking | `AbstractBooking::$internalNotes` | Small |
| Booking reschedule with `initialBookingStart/End` audit trail | `Appointment.php` lines 71-75, 359-386 | Small |
| Group bookings (multiple people on one appointment slot) | `Appointment.php` `$isFull`, `CustomerBooking.php` `$persons` | Medium |
| Recurring/sub-cycle bookings (weekly visits etc.) | `Service.php` `$recurringCycle`, `$recurringSub` | Medium |
| Aggregated price across multi-service bookings | `CustomerBooking.php` `$aggregatedPrice` | Medium |

### Availability

| Feature | Source | Complexity |
|---|---|---|
| Weekly recurring working hours per provider | `src/Domain/Entity/Schedule/WeekDay.php` | Small |
| Special days (date-range override of weekly hours) | `src/Domain/Entity/Schedule/SpecialDay.php` | Small |
| Day-off blocks (vacation, holiday) | `src/Domain/Entity/Schedule/DayOff.php` | Small |
| Time-off / breaks inside a working day | `src/Domain/Entity/Schedule/TimeOut.php` | Small |
| Per-service time-before / time-after buffer | `Service.php` `$timeBefore`, `$timeAfter` | Small |
| Slot generation algorithm (weekday minus appointments minus day-offs) | `src/Domain/Services/TimeSlot/TimeSlotService.php`, `src/Application/Services/TimeSlot/TimeSlotService.php` | Medium |
| Resources (shared equipment / rooms) | `src/Domain/Entity/Bookable/Service/Resource.php`, `Appointment.php` `$resources` | Medium |
| Per-location provider/service scoping | `src/Domain/Entity/Location/` | Medium |
| Google Calendar busy-time fetching as availability source | `src/Infrastructure/Services/Google/`, `Appointment.php` `$googleCalendarEventId` | Large |
| Outlook Calendar busy-time fetching | `src/Infrastructure/Services/Outlook/` | Large |
| Apple Calendar busy-time fetching | `src/Infrastructure/Services/Apple/` | Large |

### Packages and group bookings

| Feature | Source | Complexity |
|---|---|---|
| Packages (bundle of services sold as one SKU) | `src/Domain/Entity/Bookable/Service/Package.php`, `PackageCustomer.php`, `PackageCustomerService.php`, `PackageService.php` | Large |
| Group events (class-style, multiple attendees, tickets) | `src/Domain/Entity/Booking/Event/Event.php`, `EventPeriod.php`, `EventTicket.php`, `CustomerBookingEventTicket.php` | Large |

### Payments

| Feature | Source | Complexity |
|---|---|---|
| Payment record (amount, gateway, status, link to booking) | `src/Domain/Entity/Payment/Payment.php` | Small |
| On-site payment (no gateway; record-keeping only) | `src/Infrastructure/Services/Payment/StarterPaymentService.php` | Small |
| Deposit / partial payment policy per service | `AbstractBookable.php` `$deposit`, `$depositPayment`, `$depositPerPerson` | Medium |
| Stripe (card + Connect for splitting) | `src/Infrastructure/Services/Payment/StripeService.php`, `Domain/Entity/Stripe/` | Large |
| PayPal | `src/Infrastructure/Services/Payment/PayPalService.php` | Large |
| Square | `src/Infrastructure/Services/Payment/SquareService.php` | Large |
| Mollie | `src/Infrastructure/Services/Payment/MollieService.php` | Large |
| Razorpay | `src/Infrastructure/Services/Payment/RazorpayService.php` | Large |
| Barion | `src/Infrastructure/Services/Payment/BarionService.php` | Large |
| WooCommerce checkout hand-off | `ameliabooking.php` line 299 (WooCommerceService) | Medium |
| Coupons | `src/Domain/Entity/Coupon/Coupon.php` | Medium |
| Taxes | `src/Domain/Entity/Tax/Tax.php` | Medium |
| Invoices / receipts (PDF) | `src/Application/Services/Invoice/` | Medium |

### Notifications

| Feature | Source | Complexity |
|---|---|---|
| Email notifications (per-event templates, HTML content) | `src/Application/Services/Notification/EmailNotificationService.php`, `Domain/Entity/Notification/Notification.php` | Medium |
| SMS notifications | `src/Application/Services/Notification/SMSNotificationService.php`, `SMSAPIService.php` | Medium |
| WhatsApp notifications (template-based) | `src/Application/Services/Notification/WhatsApp*Service.php` | Large |
| Notification log (record of what was sent when and whether it succeeded) | `src/Domain/Entity/Notification/NotificationLog.php` | Small |
| Reminder schedule (offset before booking) | `Notification.php` `$timeBefore` | Small |
| Notification per-status triggers (`sendProviderStatusNotifications`, `sendCustomersStatusNotifications`, `sendRescheduledNotifications`, etc.) | `AppointmentNotificationService.php` | Medium |

### Calendar sync

| Feature | Source | Complexity |
|---|---|---|
| iCal (.ics) export per booking | `src/Application/Services/Booking/IcsApplicationService.php`, route `GET /bookings/ics/{id}` | Small |
| Google Calendar two-way sync | `src/Infrastructure/Services/Google/`, route group `src/Infrastructure/Routes/Google/` | Large |
| Outlook two-way sync | `src/Infrastructure/Services/Outlook/` | Large |
| Apple Calendar two-way sync (per-employee) | `src/Infrastructure/Services/Apple/`, `Provider::$employeeAppleCalendar` | Large |
| Microsoft Teams meeting URL per booking | `Appointment.php` `$microsoftTeamsUrl` | Medium |
| Google Meet meeting URL per booking | `Appointment.php` `$googleMeetUrl` | Medium |
| Zoom meeting per booking | `src/Domain/Entity/Zoom/ZoomMeeting.php`, `src/Application/Services/Zoom/` | Large |

### Customer-facing

| Feature | Source | Complexity |
|---|---|---|
| Public booking form / wizard | `v3/dist/index.js`, `redesign/dist/index.js` (front-end only, no PHP) | Small (we re-implement) |
| Customer cabinet (login, view bookings, reschedule, cancel) | `v3/` front-end, `LoginCabinetCommand`, `LogoutCabinetCommand` | Medium |
| Guest checkout (book without account) | `AddAppointmentCommandHandler.php` line 107 (`isCustomer` check) | Small |
| Customer reviews after appointment | `src/Domain/Entity/Entities::DASHBOARD` and review fields | Medium |
| Package purchases / package customer portal | `PackageCustomer.php`, `PackageCustomerService.php` | Medium |

### Employee-facing

| Feature | Source | Complexity |
|---|---|---|
| Employee dashboard | `src/Application/Commands/User/Provider/` | Medium |
| Time-off request workflow (employee requests, admin approves) | `DayOff.php`, `Provider::$dayOffList` | Medium |
| Schedule view (own appointments) | `Provider::$appointmentList` | Small |
| Provider profile page (public) | `Provider.php` `$show` | Small |

### Admin

| Feature | Source | Complexity |
|---|---|---|
| Reports / stats (revenue, utilization) | `src/Application/Commands/Stats/`, `src/Application/Services/Stats/` | Medium |
| Coupons | `Coupon.php` | Medium |
| Taxes | `Tax.php` | Medium |
| Custom fields per booking (free-form JSON fields) | `src/Domain/Entity/CustomField/CustomField.php`, `CustomerBooking.php` `$customFields` | Medium |
| Translations (per-language notification and label overrides) | `Notification.php` `$translations`, `Service.php` `$translations` | Medium |
| Roles and capabilities (provider, manager, admin, customer) | `Provider.php`, `Manager.php`, `Admin.php` | Medium |
| Settings page (general, company, days-off, payments) | `src/Application/Commands/Settings/`, `Domain/Services/Settings/SettingsService.php` | Medium |

### Integrations

| Feature | Source | Complexity |
|---|---|---|
| Elementor widget (booking form block) | `ameliabooking.php` lines 297-307 (`ELEMENTOR_VERSION` check) | n/a — drop |
| Gutenberg block | `src/Application/Commands/Settings/` (visual builder) | n/a — drop |
| Divi 5 module | `extensions/divi_5_amelia/` | n/a — drop |
| Divi legacy module | `extensions/divi_amelia/` | n/a — drop |
| BuddyBoss platform integration | `extensions/buddyboss-platform-addon/` | n/a — drop |
| WP Data Tables integration | `extensions/wpdt/` | n/a — drop |
| Webhooks (outgoing HTTP on booking events) | `src/Application/Services/WebHook/` | Medium |
| Zapier (read: webhooks) | (webhook feature covers it) | covered |
| Recaptcha | `src/Infrastructure/Routes/Google/Google.php` route `POST /google/recaptcha/verify` | Small |
| Mailchimp (customer sync) | `src/Application/Commands/Mailchimp/` | Medium |
| Mobile auth (provider mobile app) | `docs/provider-mobile-auth.md`, `src/Application/Commands/Mobile/` | n/a — drop |
| Cache (provider data caching layer) | `src/Domain/Entity/Cache/Cache.php` | Small (transient KV layer) |

---

## 2. Minimum-viable-clinic (MVC) subset

Amelia offers 60+ features. For a single-location dental clinic with three
dentists, a front-desk receptionist, and a Filipino/expat patient mix, the
genuinely useful subset is much smaller. This is opinionated.

### 2.1 What's in

These 12 features are the floor for a usable dental booking system.

1. **Service catalog.** Services = treatments (cleaning, filling, extraction,
   consult, whitening, etc.). Each has a name, a duration in minutes, a price
   in PHP, and a flag whether it's bookable online. Source pattern:
   `Service.php` + `AbstractBookable.php`.
   - Data: `services` table.
   - Rules: duration must be > 0 and ≤ 8 hours; price optional (the clinic
     sometimes quotes in person); `bookable_online` defaults to true.
   - UI: admin "Services" page (list + edit); patient-visible "Services" page
     that drives the booking wizard.

2. **Providers.** Dentists and hygienists. Each has a name, role, bio,
   photo, and a flag whether they're accepting new bookings.
   Source pattern: `Provider.php`.
   - Data: `providers` table.
   - Rules: only `accepting_bookings = true` providers appear in the public
     slot picker; `display_order` controls ordering.
   - UI: admin "Team" page; public "Our Team" page.

3. **Provider ↔ service mapping (many-to-many).** A dentist may perform
   cleanings, fillings, and consults but not whitening. A hygienist performs
   only cleanings. Source pattern: `Provider::$serviceList`,
   `AbstractBookable::$extras`, `Entities::EMPLOYEE/SERVICE`.
   - Data: `provider_services` join table.
   - Rules: composite primary key (`provider_id`, `service_id`).
   - UI: inline checkboxes inside "Services" and "Team" admin pages.

4. **Weekly recurring availability rules.** The clinic's default opening hours
   per provider per weekday. Source pattern: `WeekDay.php` (`dayIndex`,
   `startTime`, `endTime`, `timeOutList`).
   - Data: `availability_rules` table.
   - Rules: day-of-week 1–7 (Monday-first, matching `WeekDay::$dayIndex`);
     `start_time`/`end_time` in clinic-local time; support multiple windows
     per day (lunch break modeled as a `timeOut`, not as two separate rules,
     because that's how Amelia does it and it's the right shape).
   - UI: admin "Schedule" page, one row per (provider, weekday) with start/end
     and a sub-list of breaks.

5. **Availability overrides.** Specific-date changes — half-day closure for a
   holiday, a dentist working Saturday this week only, a one-off afternoon
   block. Source pattern: `SpecialDay.php`, `DayOff.php`.
   - Data: `availability_overrides` table.
   - Rules: `date` (single) or `date_range_start`/`date_range_end`; type is
     `block` (no appointments this day) or `extra` (these hours added on top
     of weekly rules); carries its own `start_time`/`end_time` for `extra`.
   - UI: admin "Schedule → Add override" modal.

6. **Booking window generation.** Given a provider + service + date range,
   compute the bookable slot grid. Source pattern:
   `Domain/Services/TimeSlot/TimeSlotService.php` (1153 lines — the heart of
   Amelia's slot logic) and `Application/Services/TimeSlot/TimeSlotService.php`.
   - Data: derived (no stored table).
   - Rules: `available = (weekly_rules ∪ overrides_extra) − overrides_block
     − existing_bookings − timeouts − buffer_time`. Slot grid snaps to
     `service.duration`. Minimum lead time (e.g. 2 hours ahead) enforced here.
     Return UTC ISO timestamps to the client; let the client convert.
   - UI: `/api/slots?service_id=X&provider_id=Y&date_from=…&date_to=…` endpoint
     consumed by the public booking wizard.

7. **Customer booking write.** Patient submits the wizard and the slot is
   reserved. Source pattern: `AddAppointmentCommandHandler.php` (420 lines) and
   the underlying `AppointmentApplicationService.php` (2027 lines).
   - Data: `customers` and `bookings` tables.
   - Rules: request body carries `service_id`, `provider_id`, `start_at`
     (UTC ISO), `customer` (first/last/email/phone); server re-checks slot is
     still free inside a D1 transaction with a uniqueness check on
     `(provider_id, start_at)`; status defaults to `pending` (front-desk
     approves) or `approved` (operator-configurable).
   - UI: server-side only; admin receives an in-app notification + email.

8. **Customer self-service via token link (no login).** Each booking has a
   unique signed token that lets the customer view, reschedule, or cancel
   without creating an account. Source pattern: `CustomerBooking.php`
   `$token` and the route group `GET /bookings/cancel/{id}` plus the
   `cancel/reject/approve remotely` controllers. We will simplify the URL
   surface significantly.
   - Data: `bookings.public_token` column (random 32-byte, URL-safe).
   - Rules: token must be unguessable; rate-limited; one-time "cancel" use.
   - UI: customer email contains `https://site/bookings/{token}` link.

9. **Admin calendar view.** Today / this-week / this-month of bookings with
   status badges and inline status change. Source pattern: `GetAppointments`
   and `UpdateAppointmentStatusCommand/Handler`.
   - Data: read from `bookings` + `customers` + `services` + `providers`.
   - Rules: admin-only (Cloudflare Access rule); status transitions are
     `pending → approved | rejected | canceled`, `approved → no-show | completed`.
   - UI: `/admin/calendar` page backed by a polling endpoint (no live socket
     for v1).

10. **Confirmation email + optional SMS.** Patient gets a "we received your
    request" or "you're confirmed" email with the token link; clinic gets a
    "new booking" email; optional SMS via Twilio (PH mobile numbers, single
    rate-limited blast at booking time, no reminders in v1).
    Source pattern: `AppointmentNotificationService.php` lines 59–103
    (`sendProviderStatusNotifications`, `sendCustomersStatusNotifications`).
    - Data: `notifications` table (log of sends).
    - Rules: email is mandatory, SMS is a per-booking channel; failures are
      logged but never block the booking write.
    - UI: backend only.

11. **iCal (.ics) attachment.** Each booking confirmation email includes a
    `.ics` file the patient can add to Apple/Google/Outlook calendar.
    Source pattern: `IcsApplicationService.php`, route
    `GET /bookings/ics/{id}`.
    - Data: derived (no table).
    - Rules: signed token required to fetch; one ICS per booking; no two-way
      sync in v1.
    - UI: backend only.

12. **Audit log.** Every booking write, status change, schedule edit, and
    service edit is logged with actor, timestamp, and before/after diff.
    Required because non-technical clinic staff must be able to trust that
    "the system did X". Source pattern: Amelia has no equivalent — they lean
    on WordPress's audit trails and the `wp_options` activity log. We add it
    from day one.
    - Data: `audit_log` table.
    - Rules: append-only; `actor_id` (admin user id or `system`); `entity`
      (`booking`, `service`, `provider`, `availability_rule`, …); `action`
      (`create`, `update`, `delete`, `status_change`); `before`/`after` JSON.
    - UI: admin "Activity" page, paginated, filterable.

### 2.2 What we explicitly skip and why

These Amelia features look attractive but have no place in v1. See section 5
for the full feature-gap list with rationale per item.

The big skips: payments at booking time (the clinic charges on arrival),
packages (no clinic use case), events (no class-style bookings),
multi-location (single clinic), staff time-off requests (reception handles
verbally), customer reviews (not relevant for a local dental clinic),
custom fields (the booking form has fixed fields), Zoom/Meet/Teams links
(in-person visits), WooCommerce (WordPress is gone), Elementor/Gutenberg
blocks (no WordPress), and any two-way Google/Outlook calendar sync
(add-only ICS export is enough).

---

## 3. Domain model proposal (D1-shaped)

D1 is SQLite-shaped: row-store, no enforced foreign keys unless
`PRAGMA foreign_keys = ON` is set per connection (Cloudflare's Workers
SQL driver enables it via `db.prepare(...).bind(...)` but enforcement
varies — we treat FK columns as advisory and enforce integrity in the
Worker layer). Triggers are supported but slow at scale; we avoid them.
Row size limit is effectively SQLite's 1 GB per row, but in practice each
booking row will be a few KB.

SQL is SQLite-flavored. Timestamps are stored as ISO-8601 UTC strings
(`YYYY-MM-DDTHH:MM:SS.000Z`) so they're human-debuggable and timezone-free.
Times of day in `availability_rules` are stored as `HH:MM` strings in
**clinic-local time** with the clinic's IANA timezone stored in a
singleton `settings` table. We never store local-time-with-offset.

### 3.1 `providers`

```sql
CREATE TABLE providers (
  id              INTEGER PRIMARY KEY,           -- autoincrement
  slug            TEXT NOT NULL UNIQUE,           -- url-friendly, e.g. "dr-reyes"
  first_name      TEXT NOT NULL,
  last_name       TEXT NOT NULL,
  title           TEXT,                           -- "DMD", "DDS", "Hygienist"
  bio             TEXT,                           -- markdown
  photo_url       TEXT,                           -- r2 public url
  email           TEXT,
  phone           TEXT,                           -- +63917...
  is_active       INTEGER NOT NULL DEFAULT 1,     -- boolean: accepting bookings
  display_order   INTEGER NOT NULL DEFAULT 0,
  created_at      TEXT NOT NULL,                  -- ISO-8601 UTC
  updated_at      TEXT NOT NULL
);

CREATE INDEX idx_providers_active_order
  ON providers (is_active, display_order);
```

Pattern source: `src/Domain/Entity/User/Provider.php`.

### 3.2 `services`

```sql
CREATE TABLE services (
  id                INTEGER PRIMARY KEY,
  slug              TEXT NOT NULL UNIQUE,
  name              TEXT NOT NULL,
  description       TEXT,
  duration_minutes  INTEGER NOT NULL,              -- 15..480
  buffer_before_min INTEGER NOT NULL DEFAULT 0,   -- chair setup time
  buffer_after_min  INTEGER NOT NULL DEFAULT 0,   -- cleanup time
  price_php         INTEGER,                       -- centavos; nullable for quote-only
  category          TEXT,                          -- free-text: "Preventive", "Cosmetic"
  bookable_online   INTEGER NOT NULL DEFAULT 1,   -- boolean
  display_order     INTEGER NOT NULL DEFAULT 0,
  is_active         INTEGER NOT NULL DEFAULT 1,
  created_at        TEXT NOT NULL,
  updated_at        TEXT NOT NULL,
  CHECK (duration_minutes > 0 AND duration_minutes <= 480),
  CHECK (buffer_before_min >= 0 AND buffer_after_min >= 0)
);

CREATE INDEX idx_services_active_order
  ON services (is_active, display_order, display_order);
```

Pattern source: `src/Domain/Entity/Bookable/Service/Service.php` plus
`AbstractBookable.php`. We collapse `timeBefore`/`timeAfter` and
`deposit`/`depositPayment`/`depositPerPerson`/`fullPayment` — no payments in
v1 (see section 5).

### 3.3 `provider_services`

The many-to-many join. SQLite supports `WITHOUT ROWID` composite-key tables,
which is the right shape here.

```sql
CREATE TABLE provider_services (
  provider_id  INTEGER NOT NULL,
  service_id   INTEGER NOT NULL,
  PRIMARY KEY (provider_id, service_id)
);

CREATE INDEX idx_provider_services_service
  ON provider_services (service_id);   -- reverse lookup "who offers X"
```

### 3.4 `availability_rules`

Weekly recurring rules per provider. To support multiple windows per day
(Amelia's `WeekDay.timeOutList` is the inside-day break; the model we use
here splits one window at lunchtime into two rules). We choose two rules
over a `timeOutList` because the SQL query "is `T` inside any rule?" is a
trivial range scan instead of a join.

```sql
CREATE TABLE availability_rules (
  id           INTEGER PRIMARY KEY,
  provider_id  INTEGER NOT NULL,
  weekday      INTEGER NOT NULL,         -- 1=Mon … 7=Sun (ISO)
  start_time   TEXT NOT NULL,           -- "HH:MM" clinic-local
  end_time     TEXT NOT NULL,           -- "HH:MM" clinic-local; may be "24:00"
  CHECK (weekday BETWEEN 1 AND 7),
  CHECK (end_time > start_time)
);

CREATE INDEX idx_avail_rules_provider_day
  ON availability_rules (provider_id, weekday);
```

Note: `24:00:00` semantics. Amelia handles a `WeekDay` ending at midnight
by storing `endTime` as `'24:00:00'` (see `WeekDay.php` lines 168-169 — the
toArray translates PHP midnight into the literal string `'24:00:00'`). We
allow the same; the slot generator treats `24:00` as the end of the day.

### 3.5 `availability_overrides`

Specific-date changes. `type = 'block'` removes availability; `type = 'extra'`
adds a one-off window. Source: `SpecialDay.php`, `DayOff.php`.

```sql
CREATE TABLE availability_overrides (
  id           INTEGER PRIMARY KEY,
  provider_id  INTEGER NOT NULL,
  date_from    TEXT NOT NULL,            -- "YYYY-MM-DD" clinic-local
  date_to      TEXT NOT NULL,            -- "YYYY-MM-DD" clinic-local; equal to date_from for a one-day override
  type         TEXT NOT NULL,            -- 'block' | 'extra'
  start_time   TEXT,                     -- required when type='extra'; NULL when type='block'
  end_time     TEXT,                     -- required when type='extra'
  reason       TEXT,                     -- "Christmas Day", "Half-day closure"
  CHECK (type IN ('block', 'extra')),
  CHECK (date_to >= date_from),
  CHECK ((type = 'extra' AND start_time IS NOT NULL AND end_time IS NOT NULL AND end_time > start_time)
      OR (type = 'block' AND start_time IS NULL AND end_time IS NULL))
);

CREATE INDEX idx_avail_overrides_provider_range
  ON availability_overrides (provider_id, date_from, date_to);
```

### 3.6 `customers`

Patients. We do not require an account — the customer record is created the
first time a booking is placed, keyed on email.

```sql
CREATE TABLE customers (
  id           INTEGER PRIMARY KEY,
  first_name   TEXT NOT NULL,
  last_name    TEXT NOT NULL,
  email        TEXT NOT NULL,
  phone        TEXT NOT NULL,            -- +63917...
  notes        TEXT,                     -- allergies, preferences; populated by admin later
  created_at   TEXT NOT NULL,
  updated_at   TEXT NOT NULL
);

-- We coalesce same-email customers on booking creation; this is a soft UNIQUE.
-- D1 doesn't enforce partial indexes as cleanly as Postgres, so the Worker
-- does an UPSERT and tolerates occasional dup rows (cosmetic only).
CREATE INDEX idx_customers_email ON customers (email);
CREATE INDEX idx_customers_phone ON customers (phone);
```

Pattern source: `src/Domain/Entity/User/Customer.php`. We drop `gender`
(Amelia stores it but the clinic does not need it for booking) and the
Stripe Connect references (no payments in v1).

### 3.7 `bookings`

The appointment record. The booking stores UTC timestamps so two-way
timezone confusion is impossible at the DB level. Source: `Appointment.php`
+ `CustomerBooking.php`.

```sql
CREATE TABLE bookings (
  id                INTEGER PRIMARY KEY,
  public_token      TEXT NOT NULL UNIQUE,          -- 32-byte url-safe; emailed to patient
  service_id        INTEGER NOT NULL,
  provider_id       INTEGER NOT NULL,
  customer_id       INTEGER NOT NULL,
  start_at          TEXT NOT NULL,                  -- ISO-8601 UTC, "YYYY-MM-DDTHH:MM:SS.000Z"
  end_at            TEXT NOT NULL,                  -- ISO-8601 UTC; = start_at + duration
  status            TEXT NOT NULL DEFAULT 'pending',
  internal_notes    TEXT,                           -- staff-only
  patient_notes     TEXT,                           -- free-text the patient typed in
  source            TEXT NOT NULL DEFAULT 'web',    -- 'web' | 'admin' | 'phone'
  created_at        TEXT NOT NULL,
  updated_at        TEXT NOT NULL,
  CHECK (status IN ('pending','approved','canceled','rejected','no_show','completed')),
  CHECK (end_at > start_at)
);

-- Concurrency: the booking write path does
--   INSERT ... WHERE NOT EXISTS (SELECT 1 FROM bookings
--     WHERE provider_id=? AND start_at=? AND status IN ('pending','approved'))
-- which is a single atomic check inside a D1 batch transaction.
CREATE UNIQUE INDEX idx_bookings_public_token ON bookings (public_token);
CREATE INDEX idx_bookings_provider_time
  ON bookings (provider_id, start_at)
  WHERE status IN ('pending','approved');   -- partial index, helps slot generator
CREATE INDEX idx_bookings_customer ON bookings (customer_id);
CREATE INDEX idx_bookings_status_start ON bookings (status, start_at);
```

Booking status enum: `pending`, `approved`, `canceled`, `rejected`,
`no_show`, `completed`. Source: `src/Domain/ValueObjects/String/BookingStatus.php`.

D1-specific concerns:

- **Concurrency / double-booking.** D1 enforces serializable transactions
  per-row but not strict cross-row locks. The slot picker's uniqueness
  check is on `(provider_id, start_at)` — same provider, same minute —
  and we put a `UNIQUE` partial index on the live statuses so two
  concurrent inserts fail atomically. The Worker treats the failure as
  `409 Slot taken`, the client refetches slots.
- **UTC storage.** We do not store local time in `start_at`/`end_at`.
  All conversion happens at the edge using `Intl.DateTimeFormat`.
- **No enforced FK.** The Worker layer must validate that
  `service_id`, `provider_id`, `customer_id` exist before insert. The
  `provider_services` join is also validated (provider must be allowed
  to perform that service).

### 3.8 `notifications`

Append-only log of what notification was attempted, when, on what channel,
and what the upstream responded. Source: `NotificationLog.php`.

```sql
CREATE TABLE notifications (
  id           INTEGER PRIMARY KEY,
  booking_id   INTEGER,                            -- nullable: not every notification is booking-scoped
  channel      TEXT NOT NULL,                      -- 'email' | 'sms'
  recipient    TEXT NOT NULL,                      -- email address or e164 phone
  template     TEXT NOT NULL,                      -- 'booking_pending_patient', 'booking_confirmed_clinic', etc.
  payload      TEXT,                               -- rendered subject/body or sms text
  status       TEXT NOT NULL,                      -- 'sent' | 'failed' | 'queued'
  provider_id  TEXT,                               -- upstream message id (resend/twilio)
  error        TEXT,                               -- on failure
  attempt      INTEGER NOT NULL DEFAULT 1,
  created_at   TEXT NOT NULL,
  CHECK (channel IN ('email', 'sms')),
  CHECK (status IN ('queued','sent','failed'))
);

CREATE INDEX idx_notifications_booking ON notifications (booking_id);
CREATE INDEX idx_notifications_status_created ON notifications (status, created_at);
```

### 3.9 `audit_log`

Append-only. Required for clinic staff trust (operator's spec, not from
Amelia).

```sql
CREATE TABLE audit_log (
  id           INTEGER PRIMARY KEY,
  actor_id     TEXT NOT NULL,                      -- 'system' or admin user id (email/uuid)
  entity       TEXT NOT NULL,                      -- 'booking','service','provider','availability_rule','availability_override'
  entity_id    INTEGER,                           -- nullable for some operations
  action       TEXT NOT NULL,                      -- 'create','update','delete','status_change'
  before       TEXT,                              -- JSON snapshot before
  after        TEXT,                              -- JSON snapshot after
  reason       TEXT,                              -- optional human note
  created_at   TEXT NOT NULL
);

CREATE INDEX idx_audit_entity ON audit_log (entity, entity_id, created_at);
CREATE INDEX idx_audit_actor_created ON audit_log (actor_id, created_at);
```

### 3.10 Settings singleton

Single-row config table. Holds the clinic's IANA timezone, lead time, and
notification channel toggles.

```sql
CREATE TABLE settings (
  id                  INTEGER PRIMARY KEY CHECK (id = 1),   -- singleton
  clinic_name         TEXT NOT NULL,
  clinic_timezone     TEXT NOT NULL,              -- IANA, e.g. "Asia/Manila"
  min_lead_minutes    INTEGER NOT NULL DEFAULT 120,  -- earliest bookable slot
  max_advance_days    INTEGER NOT NULL DEFAULT 60,   -- furthest ahead a booking can be made
  notify_email        INTEGER NOT NULL DEFAULT 1,   -- booleans
  notify_sms          INTEGER NOT NULL DEFAULT 0,
  clinic_calendar_url TEXT                          -- google/ics read-only url to push to (optional, v1.1)
);

INSERT INTO settings (id, clinic_name, clinic_timezone)
  VALUES (1, 'Lerio Dental Center', 'Asia/Manila');
```

### 3.11 What we deliberately do not create

| Skipped table | Reason |
|---|---|
| `packages`, `package_services`, `package_customers` | No clinic use case (section 5). |
| `events`, `event_periods`, `event_tickets` | No clinic use case. |
| `payments`, `payment_gateways` | No online payments in v1. |
| `coupons`, `taxes`, `invoices` | No payments in v1. |
| `custom_fields` | Booking form has fixed fields. |
| `locations` | Single clinic. Address lives in `settings`. |
| `resources` (shared equipment) | One dentist, one chair; add only if multiple chairs per provider later. |
| `time_outs` | Modeled as a second `availability_rules` row instead. |
| `zoom_meetings`, `google_meetings`, `teams_meetings` | In-person visits. |

---

## 4. Booking flow (end-to-end)

This is the happy-path walk-through plus every plausible failure mode we can
identify. Numbering matches the spec.

### Step 1 — Patient opens the public booking page

A static React route on the Cloudflare Pages site
(`/book`). Loads a service catalog dropdown and a month calendar.

- **Failure: page fails to load.** Cloudflare Pages serves the static
  bundle; the SPA catches fetch errors and shows a "booking currently
  unavailable, please call us" fallback with the clinic phone number.
  Booking write does not depend on this page being live.
- **Failure: stale service list.** Cache-Control: `max-age=300` on the
  service catalog GET. Worst case the patient picks a service the clinic
  just deactivated — caught at step 6 server-side.

### Step 2 — Patient selects a service

Local state only; no network call yet.

### Step 3 — Slot picker requests available slots

`GET /api/slots?service_id=X&provider_id=Y&date_from=2026-07-10&date_to=2026-07-20`

Returns:
```json
{
  "timezone": "Asia/Manila",
  "service_id": 3,
  "provider_id": 1,
  "slots": [
    {"start": "2026-07-10T01:00:00.000Z", "end": "2026-07-10T02:00:00.000Z"},
    ...
  ]
}
```

Worker logic:
1. Load `service`, `provider`, `availability_rules` for that provider,
   `availability_overrides` in the date range.
2. Load `bookings` for the provider where `start_at` is in range and
   status in `('pending','approved')`.
3. Generate slots: for each day in range, intersect
   `weekly_rules ∪ extras − blocks`, then subtract booked intervals plus
   `buffer_before/after`. Source pattern:
   `Domain/Services/TimeSlot/TimeSlotService.php` (1153 lines) and
   `Application/Services/TimeSlot/TimeSlotService.php::isSlotFree()`.

- **Failure: invalid `service_id` or `provider_id`.** 400.
- **Failure: provider is not allowed to perform that service.** The
  Worker checks `provider_services`. 400 with "this provider does not
  offer this service".
- **Failure: range too wide.** `date_to - date_from > 31 days` rejected
  to keep the query bounded.
- **Failure: provider is `is_active = 0`.** Return empty slots; UI
  shows "this provider is not currently accepting bookings".
- **Failure: race — slot appears available, taken between GET and POST.**
  Caught at step 7.

### Step 4 — Patient picks a slot and fills in name/email/phone/notes

Pure client state. The wizard's submit button is disabled until the form
is valid (Zod / manual validation).

### Step 5 — Submit fires `POST /api/bookings`

Body:
```json
{
  "service_id": 3,
  "provider_id": 1,
  "start_at": "2026-07-10T01:00:00.000Z",
  "customer": {"first_name": "Mia", "last_name": "Cruz", "email": "mia@example.com", "phone": "+639171234567"},
  "patient_notes": "first-time patient, sensitive to X",
  "turnstile_token": "..."
}
```

Worker flow:

### Step 6 — Validate

1. Zod (or hand-rolled) schema check on every field. Email regex, e164
   phone regex, `start_at` ISO-8601 and > `now()`.
2. Cloudflare Turnstile verification (the Amelia `POST /google/recaptcha/verify`
   route maps cleanly to Turnstile).
3. Rate-limit by IP: max 5 booking attempts per 10 minutes per IP via
   Cloudflare's WAF rate-limit rule or a small D1 counter.
4. Re-run the slot-free check inside the Worker (`isSlotFree`-style
   logic). This is a defense-in-depth check; the unique-index check at
   step 7 is the actual guard.

- **Failure: Turnstile fails.** 400 with `bot_detected`.
- **Failure: rate-limited.** 429 with `Retry-After`.
- **Failure: validation.** 400 with field-level errors.
- **Failure: timezone confusion.** All timestamps are UTC; the client
  converts to clinic-local for display only. The Worker never accepts a
  timestamp with an explicit offset — strips or rejects.
- **Failure: `start_at` is in the past.** 400.

### Step 7 — Write the booking to D1 (transaction)

Single D1 batch (Cloudflare D1's `db.batch([...statements])`):

```sql
-- Statement 1: ensure customer exists (UPSERT)
INSERT INTO customers (first_name, last_name, email, phone, created_at, updated_at)
  VALUES (?, ?, ?, ?, ?, ?)
  ON CONFLICT(email) DO UPDATE SET
    first_name = excluded.first_name,
    last_name = excluded.last_name,
    phone = excluded.phone,
    updated_at = excluded.updated_at
  RETURNING id;

-- Statement 2: insert booking with concurrency guard
INSERT INTO bookings (public_token, service_id, provider_id, customer_id,
                      start_at, end_at, status, patient_notes, source,
                      created_at, updated_at)
  VALUES (?, ?, ?, ?, ?, ?, 'pending', ?, 'web', ?, ?);
-- The partial UNIQUE index (provider_id, start_at) WHERE status IN (...)
-- makes this fail if another live booking already exists at that slot.

-- Statement 3: audit log
INSERT INTO audit_log (actor_id, entity, entity_id, action, after, created_at)
  VALUES ('system', 'booking', last_insert_rowid(), 'create',
          json_object('service_id', ?, 'provider_id', ?, 'start_at', ?),
          ?);
```

- **Failure: customer UPSERT collides.** Tolerated; we use the existing id.
- **Failure: unique-index violation on step 2.** Another patient booked
  the slot between steps 3 and 7. Return `409 {error: "slot_taken"}`.
  Client refetches slots and asks the patient to re-pick.
- **Failure: D1 transient error.** D1 retries internally; we treat any
  non-zero batch exit as `503`, the client retries idempotently (the
  booking id is server-issued so the client retries as a fresh insert;
  this is safe because the second attempt will hit the unique-index
  check and return `409`).

### Step 8 — Send confirmation email + optional SMS

The Worker returns success to the client **before** notifications are sent
(Amelia's pattern; see `AppointmentNotificationService.php` — notification
send is fire-and-forget post-write). We do the same: `ctx.waitUntil(...)`
runs the email and SMS sends in the background.

Email via Resend. SMS via Twilio (only if `notify_sms = 1` in settings AND
`notifications` is enabled for this booking type — for v1 we send SMS on
every confirmed booking, no per-template opt-out).

- **Failure: email fails.** Logged to `notifications` with `status=failed`
  and the error. Patient sees "we received your booking" anyway because
  the HTTP response is already 200.
- **Failure: SMS fails.** Same — logged, no patient impact.
- **Failure: both fail.** Clinic admin sees the booking in `/admin/calendar`
  and the missing notification row in `notifications`. Manual follow-up.

### Step 9 — Push to Google Calendar (optional, v1.1)

Out of scope for v1. v1 ships with iCal attachment only (see step 11).
v1.1 adds a service-account push to the clinic's Google Calendar using
the `settings.clinic_calendar_url` — see `Provider::$googleCalendar` for
the per-provider variant we may add later. Failure handling: log to
`notifications` with `template='gcal_push'`, never block the booking.

### Step 10 — Admin sees the booking in the dashboard

`/admin/calendar` polls `GET /api/admin/bookings?from=…&to=…` every 30
seconds (no live socket in v1). Status defaults to `pending`; admin
clicks Approve → `POST /api/admin/bookings/{id}/status` body
`{"status": "approved"}`. The Worker:

1. Updates `bookings.status`.
2. Appends an `audit_log` row with actor + before/after.
3. Fires `ctx.waitUntil` to send the customer an "approved" email
   (template `booking_approved_patient`) and the clinic an email
   (template `booking_approved_clinic`) via `AppointmentNotificationService.php`
   `sendCustomersStatusNotifications` / `sendProviderStatusNotifications`
   equivalent.

- **Failure: status transition invalid** (e.g. trying to go from
  `completed` back to `approved`). 400.
- **Failure: admin not authorized.** Cloudflare Access rule rejects
  unauthenticated requests before they reach the Worker.
- **Failure: stale dashboard.** 30-second poll; the admin sees the
  booking within a polling cycle of `created_at`.

### Step 11 — Customer confirmation email contains .ics

`src/Application/Services/Booking/IcsApplicationService.php` is the
reference. Worker renders a minimal `VEVENT` and either attaches it to
the email (Resend supports attachments) or hosts it at
`GET /api/bookings/{public_token}/ics` (signed token in URL — same
pattern Amelia uses for `GET /bookings/ics/{id}`).

- **Failure: ICS render bug.** Patient still gets the booking details
  inline; .ics is best-effort.

---

## 5. Feature gap: what Amelia does that we should explicitly NOT do

The following features look attractive on first read of the Amelia source
but have no place in v1. Each is cut for a concrete reason.

| Amelia feature | Source | Why we skip in v1 |
|---|---|---|
| Online payments at booking time | `Payment.php`, `src/Infrastructure/Services/Payment/*` | The clinic charges on arrival; adding Stripe opens PCI scope, refund flows, webhook reconciliation, and partial-payment policy. Add when clinic asks. |
| Deposits / partial payments | `AbstractBookable.php` `$deposit`, `$depositPayment` | Same reason. Cash-on-arrival keeps the legal and ops surface tiny. |
| PayPal, Square, Mollie, Razorpay, Barion | `src/Infrastructure/Services/Payment/*` | Each adds a webhook surface. Defer until we know which (if any) the clinic actually wants. |
| WooCommerce hand-off | `ameliabooking.php` line 299 | WordPress is gone by operator decision. |
| Stripe Connect (split payments) | `Provider::$stripeConnect`, `Customer::$stripeConnect` | No payouts to providers; clinic staff are employees on salary. |
| Packages (bundle of services as one SKU) | `Package.php`, `PackageService.php`, `PackageCustomer*.php` | The clinic sells services one at a time. Adding packages costs a third of the customer-booking data model for zero revenue. |
| Events (class-style, multiple attendees, tickets) | `Event/Event.php`, `EventTicket.php`, `CustomerBookingEventTicket.php` | The clinic runs 1:1 visits. The whole event domain (tags, periods, tickets, waitlists) is dead weight. |
| Group bookings (multiple people on one appointment) | `Appointment.php` `$isFull`, `CustomerBooking.php` `$persons` | The clinic chairs are single-occupancy; multi-patient appointments confuse the chart. |
| Recurring / sub-cycle bookings | `Service.php` `$recurringCycle`, `$recurringSub` | "Every Tuesday for 4 weeks" is rare for dental; receptionist books the 4 individual appointments. |
| Custom fields per booking | `CustomerBooking.php` `$customFields`, `CustomField.php` | The booking form has four fixed fields; custom fields add a JSON-schema admin editor and validation surface for no current ask. |
| Coupons | `Coupon.php` | No payments in v1; coupons ride on payments. |
| Taxes | `Tax.php` | Same. VAT handling in the Philippines is the clinic's accountant's job, not the booking tool's. |
| Invoices / receipts (PDF) | `src/Application/Services/Invoice/` | The clinic prints receipts on its POS-style billing software. |
| Customer reviews / ratings | not surfaced in `Domain/Entity/`, but referenced in dashboard | Not relevant for a local dental clinic; risks moderation overhead. |
| Customer cabinet (registered customer login) | `v3/`, `LoginCabinetCommand*` | The token-link flow gives patients 90% of the value (view / cancel / reschedule) with no password reset flow to maintain. |
| Provider self-service time-off requests | `DayOff.php` + admin approval flow | Receptionist edits the schedule on the dentist's behalf; one less user role to manage. |
| Per-provider Google Calendar two-way sync | `src/Infrastructure/Services/Google/`, `Provider::$googleCalendar` | Push-only ICS attachment covers 95% of the use case at 1% of the implementation cost. Two-way sync needs OAuth refresh, conflict resolution, and per-provider credentials. |
| Per-provider Outlook Calendar two-way sync | `src/Infrastructure/Services/Outlook/` | Same. |
| Per-provider Apple Calendar two-way sync | `src/Infrastructure/Services/Apple/` | Same. |
| Zoom per booking | `ZoomMeeting.php`, `src/Application/Services/Zoom/` | In-person visits. |
| Google Meet per booking | `Appointment.php` `$googleMeetUrl` | Same. |
| Microsoft Teams per booking | `Appointment.php` `$microsoftTeamsUrl` | Same. |
| WhatsApp notifications | `WhatsApp*Service.php` | Twilio SMS is cheaper and the patient base is PH-mobile-first; WhatsApp Business API requires Meta approval. |
| Multi-location support | `Location.php`, `ProviderLocation.php` | One clinic. Address is a field in `settings`. |
| Resources (shared equipment/rooms) | `Resource.php`, `Appointment.php` `$resources` | One chair per dentist; revisit only if the clinic adds a second chair. |
| Elementor widget / Gutenberg block / Divi modules | `ameliabooking.php` line 297, `extensions/divi_*/` | WordPress is gone. |
| BuddyBoss / WP Data Tables integrations | `extensions/buddyboss-platform-addon/`, `extensions/wpdt/` | Same. |
| Mailchimp customer sync | `src/Application/Commands/Mailchimp/` | Clinic marketing is not a v1 concern; add when they ask. |
| Provider mobile app auth | `docs/provider-mobile-auth.md`, `src/Application/Commands/Mobile/` | The admin dashboard on desktop covers it. |
| Custom dashboard widgets / statistics deep-dive | `src/Application/Services/Stats/`, `src/Application/Commands/Report/` | A simple "this week's bookings" count suffices for v1; deep reports are admin-via-SQL in the meantime. |
| Per-language translations of notifications | `Notification.php` `$translations` | Clinic operates in English + Filipino; staff-side labels are static, patient emails are simple enough that we ship one locale and add a second only on ask. |

---

## 6. Open questions for the operator

These come out of the source review and need a clinic-side answer before the
implementation swarm can finalize the schema and the booking flow.

1. **Deposit policy.** Amelia models deposits as a first-class concept
   (`AbstractBookable::$deposit`, `$depositPayment`, `$depositPerPerson`).
   Should the clinic charge any booking deposit — even a small PHP 500
   "no-show insurance" — at booking time? If yes, this reopens the payment
   stack (Stripe) and adds a partial-payment state machine to `bookings`.
   The current assumption in this review is "no deposit, pay on arrival";
   if that's wrong, several skipped tables come back.

2. **Cancellation policy and lead time.** Amelia's slot picker enforces a
   per-service minimum lead time (see
   `Application/Services/TimeSlot/TimeSlotService.php::getMinimumDateTimeForBooking`).
   What is the clinic's standard? Common dental defaults are "cancel up to
   24h ahead; same-day cancellation incurs PHP 500 fee". This determines
   the `settings.min_lead_minutes` default and the wording of the
   confirmation email.

3. **24h SMS reminder.** Amelia ships email + SMS reminders with a
   `timeBefore` offset (`Notification.php` `$timeBefore`). Our v1 plan is
   "no reminders" — only the booking-time confirmation. Does the clinic
   want a 24h-prior SMS reminder? Cost is small (one cron + one Twilio
   call) but it adds a Worker cron job to maintain. The same question
   applies to a 1-hour-prior reminder.

4. **Walk-in support.** The booking system assumes every appointment was
   pre-booked. Some dental clinics book walk-ins into the next free slot
   via a "quick-add" admin button. Should the admin calendar have a
   "walk-in now" action that creates a booking with
   `start_at = now(), source = 'walkin'`? This affects the slot picker
   because walk-ins consume live slots, so it's a real-time concern not
   just a UI feature.

5. **Multiple chairs / rooms.** The schema as drafted assumes one dentist,
   one chair. If the clinic has, say, 2 chairs per dentist on alternate
   days, we need a `resources` table (Amelia has this; we cut it). Worth
   confirming with the clinic owner before the migration is written.

6. **Booking confirmation by phone vs. online.** The default status flow
   in this review is `pending → approved`. Should online bookings be
   auto-approved (status `approved` immediately on POST), with the
   receptionist only stepping in on a "no" button? Or should the
   receptionist always approve manually? This affects whether the patient
   email says "we received your request" or "you're confirmed".

7. **Patient data retention / HIPAA-ish concerns.** PH doesn't have a
   HIPAA equivalent, but the clinic may still have a retention policy
   (e.g. "purge patient records 7 years after last visit"). The `customers`
   and `bookings` tables currently grow forever. Do we need a
   `archived_at` column and an admin "purge" action? Or do records live
   indefinitely? Affects the audit_log retention as well.

8. **Public holiday calendar.** The `availability_overrides` table models
   one-off closures. Does the clinic want a PH public-holiday
   auto-population, or is manual override enough?

9. **Clinic brand email.** The `from` address on confirmation emails
   (Resend requires domain verification). The clinic likely uses a
   `@leriodentalcenter.com.ph` or similar. Need the domain DNS access
   to add the SPF/DKIM records, plus the from-address branding decision.

10. **Time-of-day preference.** Some patients strongly prefer morning
    appointments. Should the schema support a `preferred_time_window` on
    the customer (and have the admin calendar filter / sort by it)? This
    is currently out of scope; confirming it stays out.

11. **Reschedule vs. cancel-and-rebook.** If a patient calls to move
    their appointment, does the receptionist edit the existing booking
    (`start_at` update, status preserved) or cancel + book a new one?
    Amelia supports both; we want to know which is the clinic's preferred
    flow because it affects the `audit_log` shape and the email
    templates (`rescheduled` vs. `canceled + booked`).

12. **Multi-language emails.** Even with a single-locale v1, do the
    email templates need both Filipino and English in the same email, or
    is one language per patient enough? Affects the `notifications.template`
    design (one template per language vs. one bilingual template).