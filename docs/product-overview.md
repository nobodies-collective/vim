# Product Overview

## What is VIM?

VIM (**V**olunteer **I**nformation **M**anager) is a web application that manages volunteer coordination for participatory events. It handles the entire lifecycle of volunteer engagement: registration, profile collection, shift browsing, signup, approval, scheduling, and on-site coordination.

## The Event

VIM was built for **Elsewhere**, a participatory burn event held annually in a remote location in Spain. Elsewhere is:

- An experiment in creative freedom, participation, and cash-free community
- Conceived, built, experienced, and returned to nothing by its participants
- Run entirely by volunteers who set up the site, keep things running during the event, and pack everything up afterward

The event follows the principles of regional Burning Man events: radical self-reliance, participation, leave no trace, and decommodification.

## The Problem VIM Solves

Running a multi-day event in a remote desert requires hundreds of volunteers across dozens of specialized teams. VIM addresses:

- **Matching volunteers to roles** based on skills, preferences, and availability
- **Covering all shifts** across three phases (setup, event, teardown) with enough people
- **Empowering team leads** to manage their own teams' staffing without central bottlenecks
- **Tracking participation** so organizers know who is doing what and where gaps exist
- **Communicating** with volunteers about their assignments via automated emails
- **On-site coordination** through the NoInfo team who can fill last-minute gaps in real time

## Project Vision

VIM is designed to be reusable. The core volunteer management logic lives in the [`meteor-volunteers`](https://github.com/goingnowhere/meteor-volunteers) package, which is event-agnostic. This application wraps that package with event-specific configuration (team definitions, organizational structure, integrations, branding).

The goal is that other participatory events could fork VIM and configure it for their own organizational structure by changing the org config and team definitions.

## Key Design Principles

- **Decentralized management**: Leads manage their own teams. Metaleads oversee departments. Managers handle system-wide settings. No single bottleneck.
- **Progressive disclosure**: Volunteers see only what they need (browse shifts, sign up). Leads see team management tools. Managers see the full system.
- **Low friction onboarding**: Magic link authentication via Fistbump lets ticket holders create accounts with minimal steps.
- **Transparency**: Logged-in volunteers can browse departments and teams before committing.

## Technology

- **Meteor.js** full-stack JavaScript framework with real-time data via DDP
- **React** frontend (migrating from Blaze templates)
- **MongoDB** database
- **Bootstrap 4** UI framework
- Internationalized in English, Spanish, and French
