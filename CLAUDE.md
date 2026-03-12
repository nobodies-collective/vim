# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

VIM (Volunteer Information Manager) is a volunteer management system for the Elsewhere event, built on Meteor. It wraps the reusable [meteor-volunteers](https://github.com/goingnowhere/meteor-volunteers) package with event-specific configuration and UI. See `docs/` for comprehensive system documentation.

## Commands

```bash
# Install dependencies (requires Meteor to be installed)
meteor npm install

# Run development server (site at http://localhost:3000/)
meteor

# Run with external packages (non-submodule setup)
METEOR_PACKAGE_DIRS=../ meteor

# Lint
npm run lint

# Update git submodules
git submodule foreach 'git pull origin master'
```

**Dev credentials (dev mode only, created by fixtures):**
- Admin: admin@nobodies.team / testtest
- Manager: manager@nobodies.team / testtest
- User: normal@nobodies.team / testtest

## Architecture

### Directory Structure
- `client/` - React entry point and components
- `server/` - Methods, publications, cron jobs, integrations
- `both/` - Shared collections, schemas, org config (`config.js`), auth initialization
- `imports/` - Lazy-loaded utilities, fixtures, styles
- `packages/` - Git submodule dependencies (meteor-volunteers, accounts-ui, email-forms, autoform, meteor-user-profiles, etc.)
- `i18n/` - Translation files (en, es, fr)

### Key Entry Points
- **Client:** `client/main.jsx` - Renders React app with Volunteers context provider
- **Server:** `server/init.js` - Loads fixtures (dev), migrations, email config
- **Shared init:** `both/init.js` - Creates Volunteers instance with event config

### Volunteers Package Integration
The core volunteer logic lives in `packages/meteor-volunteers`. This app wraps it:

```javascript
// both/init.js
export const Volunteers = new VolunteersClass({
  eventName: 'elsewhere2026',
  previousEventName: 'somethingElse2025',
  SettingsCollection: EventSettings,
})
```

Org-level config (name, domain, emails, URLs) lives in `both/config.js`.

Access collections via `Volunteers.collections.team`, `Volunteers.collections.signups`, etc.
Authorization via `Volunteers.auth.isManager()`, `Volunteers.auth.isLead()`, etc.

### Blaze/React Migration
The codebase is migrating from Blaze to React. Currently:
- Most UI is React (in `client/components/`)
- One remaining Blaze template: `managerEmailForms` (used in `/manager/emailForms` route via `gadicc:blaze-react-component`)
- `client/manager/` and `client/noinfo/` now contain React components

### Routing
React Router v5 in `client/router.jsx`. Role-based routes:
- `/dashboard` - User dashboard
- `/manager/*` - Manager admin views
- `/lead/team/:teamId` - Team lead dashboard
- `/metalead/department/:deptId` - Department lead dashboard
- `/noinfo/*` - No-info lead views (note: router uses `authTest="isALead"`, not strict NoInfo check)

Auth wrapper `RequireAuth` checks: login, email verification, VIM open date, roles, form completion.

### Collections
- `EventSettings` (`both/collections/settings.js`) - Event configuration (dates, periods)
- Users extended with: ticketId, fistbumpHash, isBanned, profile
- Volunteer form data extends `Volunteers.collections.volunteerForm`
- meteor-volunteers provides: division, department, team, lead, shift, project, rotas, signups

### Server Methods
`server/methods.js` contains validated methods using `mdg:validated-method` with auth mixins:
- Package mixins: `isManager`, `isLead`, `isAnyLead`, `isSameUserOrManager`
- Local mixins (`both/authMixins.js`): `isNoInfoMixin`, `isSameUserOrNoInfoMixin`
- Methods use MongoDB aggregation pipelines for complex queries

## Code Style

- No semicolons (`semi: ['error', 'never']`)
- 2-space indentation
- Airbnb base style with Meteor extensions
- React hooks rules enforced (`exhaustive-deps` required)
- Underscore globals allowed (legacy)

## External Integrations

Server integrates with:
- **Fistbump** (`server/fistbump.js`) - Ticket verification + magic-link authentication API
- **Quicket** (`server/quicket.js`) - Legacy ticketing integration (disabled; config commented out)
- Config via `server/env.json` (not in repo, copy from `server/env.example`)
- Rate limiting in `server/rateLimiter.js`
