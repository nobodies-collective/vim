# Rebuild Blueprint

This blueprint is for recreating VIM in a different stack (example: Next.js + FastAPI + Postgres).

## 1. Target Capabilities

A successful rebuild must support:

1. Volunteer onboarding (email/password + magic link).
2. Role-scoped operations (lead, metalead, noinfo, manager, admin).
3. Duty lifecycle (shift/project/lead/task signups and review).
4. Staffing dashboards and exports.
5. Automated notifications and ticket validation jobs.
6. Annual migration/rollover workflows.

## 2. Suggested Architecture

### Backend services

- Auth service
- Volunteer profile service
- Duty/signups service
- Org structure service
- Email queue service
- Ticket integration adapter
- Scheduler/worker service

### Frontend surfaces

- Public homepage
- Auth screens
- Volunteer dashboard
- Lead dashboard
- MetaLead dashboard
- NoInfo dashboard
- Manager tools

### Persistence

- Primary DB for users, org, duties, signups, settings.
- Queue table/stream for email and ticket checks.
- Audit log table for privileged accesses.

## 3. Route And Access Matrix

Implement equivalent routes:

- `/`, `/login`, `/signup`, `/password-reset`, `/verify-email`, `/work`, `/password`, `/profile`, `/dashboard`
- `/department/:deptId`, `/department/:deptId/team/:teamId`
- `/lead/team/:teamId`
- `/metalead/department/:deptId`
- `/noinfo`, `/noinfo/strike`, `/noinfo/userList`
- `/manager`, `/manager/eventSettings`, `/manager/emailForms`, `/manager/emailApproval`, `/manager/userList`

Apply gate order exactly as documented in [User Roles and Permissions](user-roles-and-permissions.md).

## 4. Data Model Implementation Steps

1. Implement explicit schemas from [Data Model Reference](data-model-reference.md).
2. Use foreign keys/indices for all `parentId`, `userId`, `shiftId`, `rotaId` relations.
3. Add unique/partial indexes where needed for performance and integrity:
   - user email
   - scoped role assignments
   - signup lookup paths (`parentId`, `userId`, `shiftId`, `status`)
4. Model scoped roles with inheritance (team -> department -> division).

## 5. API Contract Implementation

Implement local method equivalents from [Server Methods and Jobs](server-methods-and-jobs.md):

- profile update
- user search
- exports
- migration/import/export
- email queue operations
- noinfo stats/empty-shift queries
- magic-link verification

Design as REST/GraphQL/RPC, but keep:

- same auth boundaries
- same side effects
- same return payload semantics where UI depends on them

## 6. Core Logic Details

### Volunteer profile save

- Parse ticket as `QTK########`.
- Save profile + volunteerForm even if ticket validation fails.
- Set `profile.formFilled=true` only when submission passes schema validation.

### Signup review/enrollment

- `public` -> confirmed immediately.
- `requireApproval` -> pending until reviewer action.
- Direct assignment sets `enrolled=true`.
- Notification flags must prevent duplicate reminders.
- Enforce double-booking and capacity checks before insert.

### Export logic

- Keep output columns compatible with current CSV exports.
- Early Entry export groups by user and computes earliest arrival date (`first_start - 1 day`).
- Cantina export is build-period daily aggregation with dietary/allergy/intolerance columns.
- Open-duty urgency ordering must match the scoring formulas documented in `docs/technical-spec.md`.

### Migration logic

- Support two flows:
  - annual clone with date shift (`event.new.event` behavior)
  - JSON structure import/export
- Ensure role reassignment and lead carry-over behavior are explicit.

## 7. Integrations

### Fistbump adapter

- Implement `/verify` and `/huntthenooner` calls.
- Return typed results and classify failures:
  - not found
  - transient API error
  - hard failure
- Keep replay protection for magic-link hashes.

### Email adapter

- Queue-first architecture with manual approval option.
- Retry policy (5 tries per message).
- Circuit-breaker style safety after repeated failures.

## 8. Background Workers

Implement scheduled jobs equivalent to cron behavior:

1. Enrollment notifications
2. Review notifications
3. Email queue drain
4. Orphan signup cleanup with backup
5. Ticket recheck queue fill
6. Ticket queue processor

Make schedules data-driven via settings.

## 9. Security Requirements

1. Server-side auth checks for every privileged API.
2. Input validation and search-operator allowlists.
3. Rate limiting on auth-sensitive endpoints (magic link + account endpoints).
4. Audit log for sensitive profile-contact access.
5. Ban check on login.

## 10. Configuration Model

Separate static org config and runtime event settings:

- Static org config: display name, domain, support email, URLs.
- Runtime settings: periods, open date, cron frequency, email manual check.

Do not hardcode yearly event scope in application code for long-term maintainability.

## 11. Testing Checklist

1. Route guard tests for all protected paths.
2. Permission tests for each method by role.
3. Signup lifecycle tests (public/approval/voluntell/review).
4. Export snapshot tests (CSV columns and date filtering).
5. Migration tests with sample old/new event periods.
6. Integration contract tests with mocked Fistbump/SMTP.
7. Worker idempotency and retry tests.

## 12. Parity Acceptance Test

A rebuild is accepted when:

1. A manager can configure event settings and cron behavior.
2. A volunteer can complete form and sign up for duties.
3. Leads/metaleads can review and assign users correctly.
4. NoInfo can fill urgent shifts in real time.
5. Email notifications are queued/sent with manual-check support.
6. Exports and migration workflows produce equivalent outputs.
