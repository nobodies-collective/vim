# Volunteer Journey

This document traces the volunteer flow from first visit to active participation.

## 1. Landing And Discovery

The homepage (`/`) is public.

Before `fistOpenDate`, users see:

- Countdown timer.
- Link to early/non-onsite volunteering (`orgConfig.joinUrl`).
- About section.

After `fistOpenDate`, users see:

- VIM tagline.
- CTA to register or go to dashboard.

## 2. Registration Paths

### Standard Email/Password

1. Go to `/signup`.
2. Enter email + password (minimum 6 chars).
3. Pick UI language (`en`, `fr`, `es`).
4. Accept Code of Conduct/GDPR checkbox.
5. Account created; verification email required.

### Magic Link (Fistbump)

1. Open `/work?fornothing=HASH[&path=/target]`.
2. Server validates hash via Fistbump (`accounts.fistbump.check`).
3. Existing user:
   - Server returns a login token.
   - Client logs in with `Meteor.loginWithToken`.
4. New user:
   - Email is prefilled and locked.
   - User sets password and accepts terms.
   - Account is created with `fistbumpHash`; matching email is auto-verified.

## 3. Verification And Access Gates

Protected routes are blocked until:

1. User is authenticated.
2. User has at least one verified email.
3. `fistOpenDate` has passed, unless:
   - User has an org-domain email, or
   - User is a lead.
4. Profile form is completed (`profile.formFilled`), except while on `/profile`.

If verification is missing, user is redirected to `/verify-email`.

## 4. Profile + Volunteer Form (`/profile`)

The form persists data in two places:

- `Meteor.users.profile` (name/nickname/language/picture/formFilled).
- `volunteerForm` collection (about/skills/dietary/emergency/etc).

Key validations:

- `firstName`: required.
- `emergencyContact`: required.
- `ticketId`: optional, must match `QTK########` format when provided.

Ticket behavior on submit:

- Valid ticket -> stored on user (`ticketId`, `rawTicketInfo`).
- Invalid ticket/API issue -> rest of form still saved; user can continue.

## 5. Dashboard (`/dashboard`)

Volunteer dashboard includes:

- Responsibilities block (lead/metalead/manager/noinfo status).
- Booked duties table (`confirmed` and `pending`, excluding lead signups in this view).
- Filtered "Shifts Need Help" list.

## 6. Browsing And Signup

Shift browsing routes (`/department/:deptId`, `/department/:deptId/team/:teamId`) are protected routes; they are not public to anonymous users.

Signup behavior depends on duty policy:

- `public`: immediate `confirmed` signup.
- `requireApproval`: `pending` signup until reviewed.

Lead roles are represented as lead duties and reviewed through lead/metalead workflows.

## 7. Voluntelling

Leads and NoInfo operators can directly enroll volunteers via signup insert with `enrolled: true`.

Effects:

- Signup enters as confirmed assignment.
- Enrollment notification pipeline can send `voluntell` email.

## 8. Notifications

Main templates/events:

- `verifyEmail`: registration email verification.
- `enrollAccount`: manager invitation.
- `voluntell`: enrollment notices.
- `reviewed`: review outcomes.
- `shiftReminder`: reminders.

Delivery model:

- Render to `emailCache` first.
- Optionally wait for manager approval if `emailManualCheck` is enabled.
- Send path rate-limited (2s spacing).

## 9. Password Routes

- `/password-reset`: self-service password reset request.
- `/password`: password change (requires auth and completed form because of route guard order — this creates a catch-22 where users must complete their profile before changing their password; a rebuild should allow password changes without a completed profile).

## 10. NoInfo Event-Time Coordination

NoInfo pages provide urgent duty filling (`/noinfo`, `/noinfo/strike`) and user search (`/noinfo/userList`) for onsite operations.

Implementation note:

- Current router allows all leads to access `/noinfo*` routes (`authTest="isALead"`).
- Some server methods used there still enforce NoInfo-specific authorization.
