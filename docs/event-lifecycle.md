# Event Lifecycle

VIM supports an annual cycle: pre-open setup, build, event, strike, and rollover.

## Phases

1. **Pre-open setup**: managers/leads configure org and duties.
2. **Build/Set-up**: project-heavy staffing before event period.
3. **Event time**: shift-based operations.
4. **Strike**: teardown projects.
5. **Rollover**: migrate structure and settings to the next event scope.

## Key Settings

Configured in Event Settings (`/manager/eventSettings`):

- `eventName` (read-only in current form)
- `previousEventName`
- `eventPeriod`
- `buildPeriod`
- `strikePeriod`
- `fistOpenDate`
- `earlyEntryMax`
- `earlyEntryClose`
- `earlyEntryRequirementEnd`
- `barriosArrivalDate`
- `cronFrequency`
- `emailManualCheck`

## Access Before Open

Before `fistOpenDate`, protected routes remain closed to general users.

Bypass users:

- Org-domain emails (configured org domain check).
- Existing leads.

## Live Operations

During build/event/strike:

- Volunteers use dashboard and duty browsing.
- Leads and metaleads run staffing approvals.
- NoInfo handles urgent real-time coverage.
- Managers monitor global staffing and communications.

## Cron Jobs

Jobs are registered in `server/cron.js` and reloaded on settings updates.

Notification cron strings are built as `every {cronFrequency}` in code.

### Notification jobs

- Enrollment notifications: signups where `enrolled=true`, `notification=false`, `status='confirmed'`.
- Review notifications: signups where `reviewed=true`, `enrolled=false`, `notification=false`, `status in ['confirmed','refused']`.

### Email send job

- Email cache sender every 5 minutes (disabled when `emailManualCheck=true`).

### Maintenance jobs

- Signup GC every 3 days at 03:00 (backs up to `signupGcBackup` before deletion).
- Ticket checks:
  - Missing ticket sweep daily at 04:00.
  - Full ticket sweep Monday at 04:00.
  - Queue processor every 20 seconds.
  - Ticket jobs only run while event end is in the future and when production/test-ticket mode is enabled.

If `cronFrequency` is blank, cron is disabled.

## Rollover Paths

### Option A: In-app migration (`event.new.event`)

Copies from previous scope into current scope and shifts dates.

Includes:

- Volunteer forms
- Departments/teams
- Rotas/shifts/projects/leads
- Confirmed lead signups

Also:

- Updates `eventName` and `previousEventName` in settings.
- Clears all user `ticketId`/`rawTicketInfo`.

Limitation:

- The target scope is `Volunteers.eventName` (hardcoded in `both/init.js`).
- A developer must bump that constant before managers can perform the next-year migration through UI.

### Option B: JSON structure methods

Methods:

- `rota.all.export`
- `rota.all.import`

Use when editing structure offline or scripting migration.

Current UI limitation:

- JSON import/export controls are not exposed in active manager routes.

## Persistence Expectations

| Data | Persists Across Year | Notes |
|------|----------------------|-------|
| User accounts | Yes | Same auth identity |
| Volunteer forms | Yes | Copied during migration |
| Org structure | Yes | Copied, editable |
| Confirmed lead signups | Yes | Preserved by migration |
| Non-lead signups | No | Cleared in migration path |
| Ticket IDs | No | Explicitly unset |
| Manager/admin roles | Depends | Usually handled by explicit migrations/manual admin operations |
