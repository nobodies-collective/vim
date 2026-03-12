# Glossary

Canonical terminology for VIM, aligned with current UI labels and fixture names.

## Core Terms

| Term | Definition | UI Label / Source |
|------|------------|-------------------|
| VIM | Volunteer Information Manager | App name |
| Voluntell | Lead/NoInfo direct enrollment of a user into duty signup | `enroll` -> "Voluntell" |
| Rota | Group of related shifts for a team and date range | `add_rota`, `rota_export` |
| Duty | Generic work item type: shift, project, lead, task | Data model term |
| Signup | User-to-duty assignment record with status and metadata | `status`, `enrolled`, `reviewed`, `notification` |

## Role Terms

| Term | Definition | UI Label |
|------|------------|----------|
| Lead | Team-level lead role | `lead` |
| MetaLead | Department-level lead role | `metalead` |
| NoInfo | Special coordination role/team for urgent shift filling | `noinfo` |
| Manager | System-wide management role | `manager` |
| Admin | Highest privileged role in event scope | role assignment layer |

## Event Phase Terms

| Canonical Term | Meaning | Current UI Label |
|----------------|---------|------------------|
| Build / Set-up | Pre-event onsite work period | `build` -> "Set-up" |
| Event Time | Main event volunteering period | `event_time` -> "During Event" |
| Strike | Post-event teardown period | `strike` |
| Build and Strike | Combined reporting period | `build_strike` -> "Set-up and Strike" |
| Early Entry | Pre-event arrival eligibility from assignments | `early_entry` |

## Organization Terms

| Term | Definition |
|------|------------|
| NOrg | Top-level division name in fixture data (short for "Nowhere Organization"; retained after FixMe rename) |
| Department | Mid-level unit containing teams |
| Team | Operational unit with shifts/projects/leads |

## Canonical Fixture Names

These names should match docs and UI where shown.

### Departments

- SLAP
- Volunteers
- BDSM
- Participants Wellness
- Production
- City Planning
- Creativity
- GG&P
- Malfare

### Teams

- Demarcation Team
- NoInfo
- DVS
- Kunsthaus
- Art tours
- Art cars
- Innovation
- Fire Arena
- Power
- Sound
- Lights
- Build Crew
- Strike Crew
- Toolhaus
- LNT
- Interpreters
- Site Lead & Site Management Crew
- Malfare Office
- Nomads
- Designated Driver
- La Cantina
- Grumpy Katz Gate Krew
- Perimeter Crew
- Greeters
- Event Production Office
- Ice Ice Baby!
- Ohana House
- Shit Ninjas
- Welfare Enough

## Policy / Status Terms

| Term | Meaning |
|------|---------|
| `public` | Immediate confirmed signup |
| `requireApproval` | Pending signup until reviewed |
| `pending` | Awaiting lead review |
| `confirmed` | Accepted and assigned |
| `refused` | Explicitly declined by reviewer |
| `bailed` | Withdrawn after confirmation (by user or lead) |
| `cancelled` | System-cancelled (e.g., duty deleted) |

## Integration Terms

| Term | Definition |
|------|------------|
| Fistbump | Ticket verification + magic-link verification API |
| Quicket | Legacy ticket integration path (kept but not active) |
| Email Cache | Queue of rendered emails pending send/approval |
