# VIM - Application Overview

> **Note:** This document is superseded by the `docs/` folder, which contains comprehensive, up-to-date documentation. Start with [docs/README.md](docs/README.md) for the full documentation index. This file is retained for reference but may contain stale information.

**For new users and contributors**

---

## What Is This Application?

**VIM** (Volunteer Information Manager) is a volunteer management system for participatory arts and community events. The application helps coordinate hundreds of volunteers who make events possible.

---

## Who Uses This Application?

### Volunteers
Regular participants who sign up to help with various tasks during the event. They can:
- Create an account and complete their volunteer profile
- Browse available shifts and teams
- Sign up for work shifts during build, event, and strike periods
- View their personal schedule and commitments
- Update their availability and preferences

### Team Leads
Volunteers who coordinate specific teams (e.g., Gate, Sanctuary, Kitchen). They can:
- View and manage their team's shift schedule
- Approve or reject volunteer signups
- See who's signed up for their shifts
- Contact team members
- Export team rotas for planning

### Department Leads (Meta-leads)
Senior volunteers who oversee multiple teams within a department. They can:
- Manage multiple teams under their department
- View department-wide staffing
- Coordinate between team leads
- Access department-level reports

### Managers (Admins)
Event organizers with full system access. They can:
- Configure event settings (dates, periods, requirements)
- Create and manage the organizational structure (divisions, departments, teams)
- Import/export volunteer data
- Manage user accounts and roles
- Access all reports and statistics
- Handle early entry requirements

### NoInfo Leads
Special role for volunteer coordinators who need access to personal information for support purposes. They can:
- View volunteer profiles and contact information
- Check ticket status and attendance
- Access statistics on volunteer participation
- Help with volunteer welfare issues

---

## Key Features

### Volunteer Signup Flow
1. User creates account with email
2. Verifies email address
3. Completes volunteer profile (experience, skills, dietary needs, emergency contact)
4. Browses available shifts once registration opens (FIST date)
5. Signs up for shifts that fit their schedule
6. Receives confirmation when leads approve signups

### Shift Management
- **Build Period:** Setup shifts before the event
- **Event Period:** During the main event
- **Strike Period:** Teardown shifts after the event
- Shifts have specific times, required skills, and capacity limits

### Early Entry System
Volunteers who complete certain requirements (hours committed, specific roles) can qualify for early entry to help with event setup.

### Team Organization
```
Division (e.g., "Operations")
  └── Department (e.g., "Infrastructure")
        └── Team (e.g., "Power & Lighting")
              └── Shifts (specific work slots)
```

### External Integrations
- **Fistbump:** Ticket verification system - validates that volunteers have valid event tickets
- **Quicket:** Historical ticketing integration (deprecated)

---

## Technical Stack

| Layer | Technology |
|-------|------------|
| Framework | Meteor.js 2.x |
| Frontend | React 16 (migrating from Blaze) |
| Backend | Node.js with Meteor Methods |
| Database | MongoDB |
| Styling | Bootstrap 4, SCSS |
| Forms | Formik, AutoForm (legacy) |
| Routing | React Router v5 |
| i18n | universe:i18n (English, Spanish, French) |

---

## Getting Started

### For Development

1. **Install Meteor:**
   ```bash
   # See https://www.meteor.com/install
   ```

2. **Clone with submodules:**
   ```bash
   git clone git@github.com:nobodies-collective/vim.git --recurse-submodules
   cd volunteers-nowhere
   ```

3. **Configure environment:**
   ```bash
   cp server/env.example server/env.json
   ```

4. **Install and run:**
   ```bash
   meteor npm install
   meteor
   ```

5. **Access the app:**
   - URL: http://localhost:3000/
   - Admin login: admin@nobodies.team / testtest
   - Manager login: manager@nobodies.team / testtest
   - User login: normal@nobodies.team / testtest

### For Users

The production application is accessed through the Nowhere volunteer portal (URL provided to registered event participants).

---

## Application Structure

```
volunteers-nowhere/
├── client/                 # React frontend
│   ├── components/         # UI components by role
│   │   ├── accounts/       # Login, signup, password reset
│   │   ├── volunteer/      # Volunteer forms and dashboard
│   │   ├── lead/           # Team/dept lead views
│   │   ├── manager/        # Admin settings and tools
│   │   └── noinfo/         # Volunteer coordinator views
│   └── router.jsx          # Route definitions
├── server/                 # Backend logic
│   ├── methods.js          # API methods
│   ├── publications.js     # Data subscriptions
│   ├── fistbump.js         # Ticket verification
│   └── cron.js             # Scheduled tasks
├── both/                   # Shared code
│   ├── collections/        # Database schemas
│   └── init.js             # Volunteers package setup
├── packages/               # Meteor packages (git submodules)
│   └── meteor-volunteers/  # Core volunteer management logic
├── i18n/                   # Translation files
└── public/                 # Static assets
```

---

## Core Concepts

### Event Periods
The event is divided into distinct periods:
- **Build:** 1-2 weeks before the main event, setting up infrastructure
- **Event:** The main event itself (typically 1 week)
- **Strike:** Teardown period after the event

### Shift Types
- **Shifts:** Fixed-time work slots (e.g., "Gate 8am-12pm")
- **Projects:** Flexible tasks without strict times
- **Rotas:** Recurring shift patterns

### User Roles
Managed via `alanning:roles` package with event-scoped permissions:
- `admin` - Full system access
- `manager` - Event management
- `noinfo` - Volunteer welfare access
- Team/department IDs as roles for leads

### FIST Date
"FIST Open Date" - when volunteer signup opens to the general public. Before this date, only leads and managers can access the system.

---

## Data Privacy

This application handles personal information including:
- Contact details (email, emergency contacts)
- Dietary requirements and allergies
- Medical conditions
- Ticket/attendance information

**Important:** The application falls under GDPR regulations. See `SECURITY_AUDIT_REPORT.md` for current compliance status and required improvements.

---

## Known Limitations

1. **Hybrid UI:** Currently transitioning from Blaze to React - some features use legacy technology
2. **React Version:** Using React 16 (end-of-life), upgrade blocked by Blaze dependencies
3. **Mobile:** Basic responsive design, no dedicated mobile app
4. **Offline:** Requires internet connection, no offline mode

---

## Contributing

The core volunteer management logic is in a separate package ([meteor-volunteers](https://github.com/goingnowhere/meteor-volunteers)) designed to be reusable by other events.

### Code Style
- ESLint with Airbnb base configuration
- No semicolons
- 2-space indentation
- React hooks rules enforced

### Before Contributing
1. Read `CLAUDE.md` for development guidance
2. Review `SECURITY_AUDIT_REPORT.md` for known issues
3. Check `TODO_PRIORITIZED.md` for planned work

---

## Support

- **Issues:** https://github.com/nobodies-collective/vim/issues

---

## License

This project supports the Nowhere community. Check repository for specific license terms.
