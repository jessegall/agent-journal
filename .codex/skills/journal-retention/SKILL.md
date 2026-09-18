---
name: journal-retention
description: Reports age out and finished to-dos are archived after their keep days, once an hour
---

# Retention

Reports age out and finished to-dos are archived after their keep days, once an hour.

keep.report and keep.todo are days per environment; 0 keeps everything listed.

It listens to: agent.updated. It speaks every 60 minutes. On by default; the viewer's Settings switches it per environment, and `triggers.retention` in the environment's settings tunes it.
