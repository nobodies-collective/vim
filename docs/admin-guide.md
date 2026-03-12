# Admin Guide

This guide documents manager/admin capabilities implemented in the current codebase.

## Manager Routes

- `/manager`
- `/manager/eventSettings`
- `/manager/emailForms`
- `/manager/emailApproval`
- `/manager/userList`

All are protected by `RequireAuth` with `authTest="isManager"`.

## Manager Dashboard (`/manager`)

### Sidebar

- Staffing totals: leads, metaleads, shifts.
- Event Settings.
- New Department.
- Cantina Set-up CSV export (`cantina.setup`).
- Global rota CSV export (`all.rota`).
- Early Entry tools + CSV export (`ee.csv`).
- Danger Zone:
  - Send Reminders to everyone (`email.sendMassShiftReminder`).
  - Prepare VIM for a new event (`event.new.event`).

### Main Pane

- Build and Strike staffing report.

## Event Settings (`/manager/eventSettings`)

Backed by `settings.update` and `SettingsSchema`.

Editable fields:

- `previousEventName`
- `eventPeriod`
- `buildPeriod`
- `strikePeriod`
- `earlyEntryMax`
- `barriosArrivalDate`
- `fistOpenDate`
- `earlyEntryClose`
- `earlyEntryRequirementEnd`
- `cronFrequency`
- `emailManualCheck`

Read-only field:

- `eventName` (disabled in current form)

Behavior:

- Changes apply immediately.
- Cron observer reloads schedules on settings changes.
- `cronFrequency` is interpolated into `every {cronFrequency}` for notification jobs (for example, `15 mins`).

## User Management (`/manager/userList`)

Current manager controls include:

- View detailed user profile modal.
- Send enrollment email (`Accounts.sendEnrollment`).
- Send review summary (`email.sendReviewNotifications`).
- Send shift reminder (`email.sendShiftReminder`).
- Grant/revoke manager role.
- Grant/revoke admin role.

Important current-state note:

- Ban/unban and direct password-change controls are not exposed in the current React user list controls.
- `Accounts.adminChangeUserPassword` exists server-side but has no active manager UI in this codebase.

## Email Operations

### Templates (`/manager/emailForms`)

Managers maintain templates used by:

- `enrollAccount`
- `verifyEmail`
- `voluntell`
- `reviewed`
- `shiftReminder`

### Queue Approval (`/manager/emailApproval`)

Queue methods:

- `emailCache.get`
- `emailCache.send`
- `emailCache.delete`
- `emailCache.reGenerate`

When `emailManualCheck` is off, cached emails are auto-sent by cron job.

## Exports

### CSV Exports

| Method | Purpose | Scope |
|--------|---------|-------|
| `team.rota` | Confirmed team signups export | Lead |
| `dept.rota` | Confirmed department signups export | MetaLead |
| `all.rota` | Confirmed global signups export | Manager |
| `ee.csv` | Early-entry planning export | Lead/MetaLead/Manager |
| `cantina.setup` | Build-period food headcount and dietary/allergy counts | Manager |

### JSON Structure Import/Export

Methods exist:

- `rota.all.export`
- `rota.all.import`

Current UI note:

- The current manager dashboard does not expose JSON import/export buttons in active routes.
- Use method/API invocation directly if this workflow is required.

## New Event Migration

Migration method:

- `event.new.event`

What it does:

1. Clones org structure and duties from previous event scope.
2. Copies volunteer forms.
3. Preserves confirmed lead signups.
4. Shifts dates by event-start day delta.
5. Updates event settings (`eventName`, `previousEventName`, periods).
6. Clears all user ticket IDs/raw ticket info.

Critical limitation:

- Migration depends on `Volunteers.eventName` in `both/init.js` already being moved to the new event scope by a developer.
- If that prerequisite is not met, the UI shows a "developer required" message and migration cannot proceed from manager UI alone.

## Cron And Automation

Configured in `server/cron.js`.

When `cronFrequency` is set:

- Enrollment notifications job.
- Review notifications job.
- Email cache sender (every 5 minutes, if manual check off).
- Signup GC backup/removal (every 3 days at 03:00).
- Ticket recheck jobs (daily/weekly + queue processor) when production or `devConfig.testTicketApi` is enabled.

If `cronFrequency` is empty:

- SyncedCron is stopped.

## Troubleshooting Notes

- Orphaned signup cleanup backups are stored in `signupGcBackup`.
- Failed email retries move to `emailFails` after 5 retries.
- Email sender hard-stops after >10 consecutive failures.
