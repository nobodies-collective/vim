# Integrations

VIM integrates with ticket verification/auth providers and SMTP email delivery.

## Fistbump (Primary External Integration)

### Endpoints used

1. Verify magic-link hash:
   - `GET {NOONER_HUNT_API}/verify?key={NOONER_HUNT_KEY}&v={hash}`
2. Lookup ticket by email/ticket:
   - `GET {NOONER_HUNT_API}/huntthenooner?key={NOONER_HUNT_KEY}&nooner={email_or_QTK########}`

### Magic-link flow

1. User opens `/work?fornothing=HASH`.
2. Client calls `accounts.fistbump.check`.
3. Server verifies hash with Fistbump and returns:
   - existing user + server login token, or
   - new-user bootstrap payload (email/ticketId/raw data).
4. Existing users are logged in via token.
5. New users create account with prefilled email and verified status.

Security controls:

- Replay protection via `fistbumpHashUsed` (same hash cannot be reused).
- Rate limiting on `accounts.fistbump.check` in `server/rateLimiter.js`.

### Ticket verification flow

Used during profile save and periodic background checks.

Behavior:

- Valid ticket -> set `ticketId` + `rawTicketInfo`.
- No ticket found -> ticket fields removed (where applicable).
- API errors -> user flow continues; ticket update may be skipped.

### Configuration

Source file: `server/config.js`.

Production:

- Uses environment variables `NOONER_HUNT_API` and `NOONER_HUNT_KEY`.

Development:

- Loads `server/env.json` and maps values onto runtime config keys.
- Current code reads lower-cased keys (`noonerHuntApi`, `noonerHuntKey`) from JSON.

## Quicket (Legacy)

`server/quicket.js` remains in repo but is marked as no longer used.

Legacy responsibilities were:

- Fetch guest list.
- Match users by email.
- Sync ticket metadata and detect changes/transfers.

## Email System

Collections:

- `emailCache`
- `emailLogs`
- `emailFails`

Pipeline:

1. Template rendered with context.
2. Cached in `emailCache`.
3. If manual approval is enabled, manager approves per email.
4. Sender drains queue with 2-second spacing.
5. Success -> `emailLogs`; repeated failure -> `emailFails`.

Retry/failure limits:

- Per-email retries up to 5.
- Global sender abort after >10 consecutive failures.

## Email methods

Manager-only operations include:

- Queue management: `emailCache.get/send/delete/reGenerate`.
- Notifications: `email.sendShiftReminder`, `email.sendMassShiftReminder`, `email.sendReviewNotifications`.

Templates in use:

- `enrollAccount`
- `verifyEmail`
- `voluntell`
- `reviewed`
- `shiftReminder`

## Fail-safe behavior

If external integrations are unavailable:

- Core signup and volunteering still function.
- Ticket-linked features degrade gracefully.
- Notification sending behavior depends on email queue state and SMTP availability.
