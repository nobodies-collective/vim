# VIM Runbook

Operational reference for deploying and running VIM (volunteer shift management for Elsewhere).

## Deployment

Hosted on Hetzner via Coolify (self-hosted PaaS). Coolify builds from the `main` branch of
`github.com/nobodies-collective/fist` using the repo's `Dockerfile` and `docker-compose.yml`.

### Services

| Service | Image | Purpose |
|---------|-------|---------|
| fist | Built from repo | Meteor app (Node 14, Alpine) |
| mongo | mongo:4.4.18 | MongoDB database |
| mongo-backup | tiredofit/mongodb-backup | Automated DB backups to volume |

### Volumes

| Volume | Mounted on | Contents |
|--------|------------|----------|
| mongo_dbdata | mongo:/data/db | Database files |
| mongo_backup | mongo-backup:/backups | XZ-compressed mongodump backups (every 12h, kept 6 days) |
| user_data | fist:.../profilePictures | Uploaded profile pictures |

## Environment Variables

### Set in Coolify UI (secrets)

| Variable | Required | Example | Notes |
|----------|----------|---------|-------|
| `MAIL_URL` | Yes | `smtp://user:pass@smtp.gmail.com:587` | For Google Workspace: use an App Password, not the account password |
| `NOONER_HUNT_KEY` | No* | API key string | Fistbump ticket verification API key. App starts without it but logs a warning; ticket lookups will fail. |

*Was required before the startup validation fix. Now warns instead of crashing.

### Set in docker-compose.yml (defaults)

| Variable | Default | Override via |
|----------|---------|-------------|
| `ROOT_URL` | `https://fist.nobodies.team` | Coolify env or compose override |
| `NOONER_HUNT_API` | `https://fistbump.goingnowhere.org/huntthenooner` | Coolify env |
| `MONGO_URL` | `mongodb://mongo/volunteers` | Only change if using external MongoDB |
| `NODE_ENV` | `production` | Don't change |

### Google Workspace SMTP

To use Gmail/Google Workspace as the mail relay:

1. Enable 2FA on the sending Google account
2. Generate an App Password at https://myaccount.google.com/apppasswords
3. Set `MAIL_URL` to: `smtp://<email>:<app-password>@smtp.gmail.com:587`
   - URL-encode any special characters in the password (e.g. `@` -> `%40`)

## External Services

### Fistbump (ticket verification)

- **URL:** `https://fistbump.goingnowhere.org/huntthenooner`
- **What it does:** Verifies that users hold a valid event ticket. Called on signup and periodically via cron.
- **If unavailable:** App runs fine. Users can sign up and use VIM, but their ticket status won't be verified. The cron job logs errors but doesn't crash.
- **Credentials:** `NOONER_HUNT_KEY` env var (API key)

### Quicket (ticketing system)

- **Status:** Disabled. Code exists in `server/quicket.js` but config is commented out in `server/config.js`.
- **To re-enable:** Uncomment the three config keys (`QUICKET_API_KEY`, `QUICKET_USER_TOKEN`, `QUICKET_EVENT_ID`) and set the env vars.

## Yearly Event Cycle

Before each event, update these hardcoded values:

| What | File(s) | Example |
|------|---------|---------|
| Event name | `both/init.js`, `imports/fixtures/settings-fixtures.js` | `nowhere2026` |
| Previous event name | Same files | `nowhere2025` |
| Role migration | `server/migrations.js` | Promote previous year's admins/managers to new scope |
| Email from address | `server/email.js` | `VIM <vim@nobodies.team>` |
| Site name | `server/email.js` | `VIM Elsewhere 2026` |
| Homepage title | `client/components/HomePage.jsx` | `Co-Create Elsewhere 2026` |
| Homepage links | `client/components/HomePage.jsx` | Update org website URLs |
| Email domain gate | `server/accounts.js`, `client/components/RequireAuth.jsx` | `@nobodies.team` (controls early access before VIM open date) |
| Fixture email from | `imports/fixtures/settings-fixtures.js` | `no-reply@nobodies.team` |

## Dev Credentials (local only)

- Admin: `admin@nobodies.team` / `testtest`
- Manager: `manager@nobodies.team` / `testtest`
- User: `normal@nobodies.team` / `testtest`

Loaded from fixtures when `NODE_ENV` is not `production`.

## Local Development

```bash
# Start with Docker
docker compose up -d

# Or run Meteor directly (requires Meteor installed)
meteor

# With external packages (non-submodule setup)
METEOR_PACKAGE_DIRS=../ meteor
```

**Important:** Git submodules must be initialized for the Docker build to work:
```bash
git submodule update --init --recursive
```

## Backup & Restore

The `mongo-backup` service dumps MongoDB every 12 hours (at 03:00), keeps backups for 6 days, and compresses with XZ.

Backups are stored in the `mongo_backup` volume. To restore:
```bash
# Find the backup file
docker compose exec mongo-backup ls /backups

# Restore (adjust filename)
docker compose exec mongo mongorestore --drop /backups/<filename>
```

## Known Technical Debt

| Item | Severity | Notes |
|------|----------|-------|
| Node.js 14 (EOL Apr 2023) | High | Tied to Meteor version |
| MongoDB 4.4 (EOL Feb 2024) | High | Meteor 2.x supports up to 6.0 |
| Meteor 2.11 | Medium | 2.16+ or 3.x would unblock Node upgrade |
| React 16 | Low | Works but no longer maintained |
| `goingnowhere:volunteers` Meteor package name | Medium | Renaming requires package.js change + all import updates |
