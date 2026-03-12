# User Roles and Permissions

VIM uses scoped roles tied to organizational units (department/team IDs) plus global manager/admin roles.

## Effective Role Model

1. **Volunteer**: any authenticated user.
2. **Lead**: confirmed signup to a team-level lead duty.
3. **MetaLead**: confirmed signup to a department-level lead duty.
4. **NoInfo**: NoInfo team lead (plus managers via auth helper).
5. **Manager**: global management role in event scope.
6. **Admin**: highest privileged role in event scope.

## Volunteer

Can:

- Register with email/password or magic link.
- Verify email (email/password path).
- Complete profile and volunteer form.
- Browse and apply/signup for open duties.
- View dashboard and booked duties.
- Edit own profile, emails, and password.

Route access:

- `/dashboard`, `/profile`, `/password`, `/department/:deptId`, `/department/:deptId/team/:teamId`.

## Lead (Team)

Can do everything a volunteer can, plus:

- Access `/lead/team/:teamId` for teams where they are a lead.
- Edit team metadata.
- Create rotas and projects.
- Review pending requests.
- Enroll volunteers directly ("Voluntell").
- Export team rota CSV via `team.rota`.
- Search users by name/email and ticket number.
- Request user contact via `users.requestContact` (reason required, min 10 chars, audit logged).

## MetaLead (Department)

Can do lead-level tasks across their department, plus:

- Access `/metalead/department/:deptId` for departments where they are lead.
- Edit department settings.
- Create teams.
- Review lead applications across dept/team scope.
- Export department rota CSV via `dept.rota`.
- Export Early Entry CSV via `ee.csv`.

## NoInfo

NoInfo status is resolved server-side via auth helper (`Volunteers.services.auth.isNoInfo()`), which treats managers as NoInfo-capable.

Can:

- Use NoInfo dashboards (`/noinfo`, `/noinfo/strike`) for urgent gap-filling workflows.
- Access NoInfo user list (`/noinfo/userList`) and full user profile modal.
- Use user statistics (`users.stats`).

Important implementation note:

- Router guard currently uses `isALead` for `/noinfo*` routes, so any lead can route-hit these pages. Some server methods inside NoInfo pages still enforce NoInfo-specific auth.

## Manager

Can do all of the above, plus:

- Access `/manager`, `/manager/eventSettings`, `/manager/emailForms`, `/manager/emailApproval`, `/manager/userList`.
- Manage event settings (`settings.update`).
- Manage email cache queue (`emailCache.get/send/delete/reGenerate`).
- Send reminders (`email.sendShiftReminder`, `email.sendMassShiftReminder`, `email.sendReviewNotifications`).
- Export all rota CSV (`all.rota`), cantina setup CSV (`cantina.setup`), and Early Entry CSV (`ee.csv`).
- Trigger new-event migration (`event.new.event`) when preconditions are met.
- Grant/revoke manager/admin roles from manager user list.

## Admin

Admin is effectively manager-plus. In current UI, admin-specific distinction is mostly role assignment power and full access parity with managers.

## Access Gates (RequireAuth)

For protected routes, `RequireAuth` enforces this order:

1. User loaded and authenticated.
2. At least one verified email.
3. `fistOpenDate` gate (VIM open date; bypass for org-domain emails or leads).
4. Route-specific auth test (for manager/lead/noinfo pages).
5. Completed form (`profile.formFilled`) unless on `/profile`.

## Permission Enforcement Layers

1. **Client route guards**: `client/components/RequireAuth.jsx`.
2. **Server method mixins**:
   - Package mixins from `Volunteers.services.auth.mixins` (`isManager`, `isLead`, `isAnyLead`, `isSameUserOrManager`, etc.).
   - Local mixins in `both/authMixins.js` (`isNoInfoMixin`, `isSameUserOrNoInfoMixin`).
3. **Scoped roles hierarchy** via `alanning:roles` with team->department->division inheritance.
