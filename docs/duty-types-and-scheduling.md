# Duty Types and Scheduling

VIM has four types of duties that volunteers can sign up for, plus a scheduling structure (rotas) that organizes shifts into patterns.

## Duty Types

### Shifts

The most common duty type. A shift is a specific time slot on a specific day.

**Properties:**
- **Title**: Name of the shift (e.g., "Morning Gate Shift")
- **Start/End time**: Exact datetime range
- **Min/Max volunteers**: How many people are needed vs. maximum capacity
- **Priority**: Essential, important, or normal — affects display ordering
- **Policy**: Public (anyone can sign up) or requireApproval (lead must confirm)
- **Skills**: Required or preferred skills for this shift
- **Quirks**: Characteristics like "sober shift"
- **Rota**: The shift group this shift belongs to

Shifts are typically 4-8 hours during event time.

### Projects

A project is a multi-day commitment, typically used for setup and strike work.

**Properties:**
- **Title**: Name of the project (e.g., "Build Middle of FixMe")
- **Start/End date**: Date range (not specific times)
- **Min/Max volunteers**: Staffing targets
- **Priority and policy**: Same as shifts
- **Skills and quirks**: Same as shifts

Volunteers signing up for a project commit to working during that date range. Unlike shifts, they don't have fixed hour-by-hour schedules — the work is typically "all day with a siesta."

### Lead Positions

A lead position is a role rather than a time commitment. Signing up for a lead position grants team management permissions.

**Properties:**
- **Title**: Usually "Lead" or "Meta-Lead"
- **Description**: What the lead role entails for this team
- **Priority**: Typically "essential"
- **Policy**: Always `requireApproval` — leads must be vetted
- **Parent**: The team or department this lead role governs

When a volunteer is confirmed as a lead, they gain the corresponding role permissions (see [User Roles](user-roles-and-permissions.md)).

### Tasks

Tasks exist in the data model but are less commonly used. They represent one-off pieces of work that don't fit the shift or project pattern.

**Properties:**
- **Title**: Description of the task
- **Start/End**: Datetime range
- **Min/Max volunteers**: Staffing targets
- **Priority and policy**: Same as shifts

Tasks share the same signup mechanics as shifts but are typically used for ad-hoc work assignments rather than recurring schedules.

## Rotas (Shift Groups)

A rota is a container that groups related shifts into a pattern. Rotas make it easier for leads to manage recurring shift schedules.

**Properties:**
- **Title**: Name of the shift group (e.g., "Gate Day Shifts", "Nomad Patrols")
- **Start/End date**: The date range this rota covers
- **Parent team**: Which team these shifts belong to

**How rotas work:**
1. A lead creates a rota for their team with a date range
2. Individual shifts are created within that rota
3. The rota groups those shifts together in the UI (tabbed views, reports)
4. Volunteers browsing shifts see them organized by rota

For example, the Gate Krew might have:
- Rota: "Gate Shifts - Event Week" (July 8-14)
  - Shift: "Morning Gate" (8am-2pm, July 8)
  - Shift: "Afternoon Gate" (2pm-8pm, July 8)
  - Shift: "Night Gate" (8pm-2am, July 8)
  - ... repeated for each day

## Signup Statuses

A signup (the association between a volunteer and a duty) progresses through these statuses:

```
                          ┌──────────┐
                          │ pending  │ ← Volunteer applies (approval-required)
                          └────┬─────┘
                               │
                    ┌──────────┴──────────┐
                    │                     │
              ┌─────▼─────┐        ┌─────▼─────┐
              │ confirmed │        │  refused  │
              └─────┬─────┘        └───────────┘
                    │
           ┌────────┴────────┐
           │                 │
     ┌─────▼─────┐    ┌─────▼──────┐
     │  bailed   │    │ cancelled  │
     └───────────┘    └────────────┘
```

- For **public** duties, the signup goes directly to `confirmed` (skipping `pending`).
- For **voluntell** (direct enrollment by lead/NoInfo), the signup goes directly to `confirmed` with `enrolled=true`.
- **Bailed**: Volunteer or lead withdraws after confirmation.
- **Cancelled**: System removes signup (e.g., referenced duty deleted by signup GC).

**Additional signup metadata:**
- `enrolled`: True if a lead/NoInfo voluntold the user (vs. self-signup)
- `notification`: True if the user has been emailed about this signup
- `reviewed`: True if a lead has reviewed a pending application

## Signup Policies

Each duty has a policy that controls how signups work:

| Policy | Behavior |
|--------|----------|
| `public` | Anyone can sign up; immediately confirmed |
| `requireApproval` | Signup creates a pending request; lead must approve |

Lead positions always use `requireApproval` regardless of the team's default policy.

## Capacity and Staffing

Each duty has staffing targets:

- **Min** (needed): The minimum number of volunteers required for the duty to function
- **Max** (wanted/spaces): The maximum number of volunteers that can sign up

The system tracks and displays coverage ratios throughout:
- **Volunteer dashboard**: Shows shifts that "need help" (below max)
- **Lead dashboard**: Shows confirmed vs. needed counts for their team
- **Dept dashboard**: Aggregated across all teams
- **Manager dashboard**: Global lead, metalead, and shift fill rates

## Scheduling in the UI

### For Volunteers
The dashboard's "Shifts Need Help" panel shows a filterable list of duties with open spots. Volunteers can filter by type (all, event-time shifts, setup/strike, lead positions).

### For Leads
The lead dashboard shows duties in a tabbed interface:
- **Shift rotas**: Each rota as a tab showing its shifts
- **Projects**: Listed with signup status
- **Lead positions**: With current and pending applicants

Leads can also view a "Build and Strike" staffing report showing coverage over time.

### For NoInfo
The NoInfo dashboard shows unfilled shifts for the current period (event time or strike), sorted by urgency. NoInfo coordinators can directly enroll volunteers from this view.

## Data Exports

Several CSV exports are available for scheduling data:

| Export | Available to | Content |
|--------|-------------|---------|
| Team rota | Leads | All confirmed signups for a team with volunteer details |
| Department rota | Metaleads | All confirmed signups across department teams |
| All rotas | Managers | Every confirmed signup in the system |
| Early entry | Leads/Managers | Volunteers with pre-event shifts who need early site access |
| Cantina setup | Managers | Daily build-period headcounts by dietary preference, allergies, and intolerances |
