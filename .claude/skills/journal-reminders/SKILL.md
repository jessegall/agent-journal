---
name: journal-reminders
description: The standing reminders said again to the agent, on idle by default
---

# Reminders

The standing reminders said again to the agent, on idle by default.

Set triggers.reminders to {every, unit} or {on} to change when they are said.

It listens to: agent.updated. It speaks on idle. On by default; the viewer's Settings switches it per environment, and `triggers.reminders` in the environment's settings tunes it.
