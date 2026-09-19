---
name: journal-hub
description: The hub page shows every journal running on this machine as one expandable status bar, live over each peer's own stream
---

# Every journal on this machine, one bar each

The hub page shows every journal running on this machine as one expandable status bar, live over each peer's own stream.

Always on: every viewer answers /api/summary and lets a sibling viewer on this machine read and act on it; the hub page is under the journal switcher.

It listens to: . It speaks on the events it listens to. On by default; the viewer's Settings switches it per environment, and `triggers.hub` in the environment's settings tunes it.
