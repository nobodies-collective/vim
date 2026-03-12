# VIM Documentation

**VIM** (Volunteer Information Manager) is a volunteer coordination platform.

This folder has two layers of documentation:

- **Operational guides** for volunteers, leads, metaleads, managers, and admins.
- **Rebuild references** for engineers recreating the system in another stack.

## Contents

| Document | Description |
|----------|-------------|
| [Product Overview](product-overview.md) | Scope, goals, and event context |
| [User Roles and Permissions](user-roles-and-permissions.md) | Route and method-level access model |
| [Volunteer Journey](volunteer-journey.md) | Registration to shift-signup flow |
| [Organizational Structure](organizational-structure.md) | Division, department, and team hierarchy |
| [Duty Types and Scheduling](duty-types-and-scheduling.md) | Shift/project/lead/task model and signup behavior |
| [Event Lifecycle](event-lifecycle.md) | Build, event, strike, and rollover lifecycle |
| [Lead Guide](lead-guide.md) | Team lead, metalead, and NoInfo workflows |
| [Admin Guide](admin-guide.md) | Manager/admin workflows, exports, and email operations |
| [Integrations](integrations.md) | Fistbump, legacy Quicket, SMTP/email system |
| [Data Model Reference](data-model-reference.md) | Collection schemas, relationships, and enums |
| [Server Methods and Jobs](server-methods-and-jobs.md) | API method contracts, cron tasks, and rate limiting |
| [Technical Specification](technical-spec.md) | Cross-stack implementation contract |
| [Rebuild Blueprint](rebuild-blueprint.md) | Step-by-step rebuild guidance and acceptance criteria |
| [Design Intent vs Reality](design-intent-vs-reality.md) | Gap analysis and architectural guidance for a greenfield rebuild |
| [Glossary](glossary.md) | Canonical terms and UI naming |

## Source Of Truth Rule

When documentation conflicts with code, treat these as authoritative:

1. `client/router.jsx` and `client/components/RequireAuth.jsx` for route access.
2. `server/methods.js`, `both/methods.js`, and `server/email.js` for server-side behavior.
3. `server/cron.js` and `server/ticketCron.js` for background automation.
4. `both/collections/*.js` for validated local schemas.
5. `imports/fixtures/units-fixtures.js` for default org structure names.

## Audience

- Event organizers and operations teams
- Leads, metaleads, managers, and admins
- Engineers maintaining or migrating the system
- Agents or developers rebuilding this app in a new language/framework
