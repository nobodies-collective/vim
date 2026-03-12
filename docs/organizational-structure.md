# Organizational Structure

VIM models a three-level hierarchy:

1. Division
2. Department
3. Team

## Division

Current default division:

- `NOrg`

## Departments (Fixture Defaults)

- SLAP
- Volunteers
- BDSM
- Participants Wellness
- Production
- City Planning
- Creativity
- GG&P
- Malfare

## Teams By Department (Fixture Defaults)

### SLAP

- Power
- Sound
- Lights

### Volunteers

- NoInfo
- DVS
- La Cantina

### BDSM

- Build Crew
- Strike Crew
- Toolhaus
- LNT
- Designated Driver

### Participants Wellness

- Site Lead & Site Management Crew

### Production

- Event Production Office
- Ice Ice Baby!
- Shit Ninjas

### City Planning

- Demarcation Team

### Creativity

- Kunsthaus
- Art tours
- Art cars
- Innovation
- Ohana House

### GG&P

- Grumpy Katz Gate Krew
- Perimeter Crew
- Greeters

### Malfare

- Fire Arena
- Interpreters
- Nomads
- Malfare Office
- Welfare Enough

## Data Characteristics

### Department fields

- name
- description
- policy
- parentId (division)

### Team fields

- name
- description
- policy
- parentId (department)
- optional: skills, quirks, email, location

### Lead role bootstrapping

Fixture creation inserts lead duties automatically:

- One Meta-Lead duty per department
- One Lead duty per team

It also creates role hierarchy links:

- department role -> parent division role
- team role -> parent department role

### Permission Impact

1. Team leads manage their own team duties/signups.
2. MetaLeads manage department-level operations and oversight.
3. Managers/admins have global scope.

## Operational Notes

- Managers can create departments.
- MetaLeads can create teams.
- Team leads can edit team settings.
- Team move/delete flows exist at department dashboard level in current UI.
