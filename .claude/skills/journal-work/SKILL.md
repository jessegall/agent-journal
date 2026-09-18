---
name: journal-work
description: Work started for a to-do is linked to it; work ended --todo closes the row; open work is said on idle
---

# Work

Work started for a to-do is linked to it; work ended --todo closes the row; open work is said on idle.

Start work with --todo=<n> to take a row; end it with --todo to close the row with it.

It listens to: agent.updated, work.completed, work.created. It speaks on idle. On by default; the viewer's Settings switches it per environment, and `triggers.work` in the environment's settings tunes it.
