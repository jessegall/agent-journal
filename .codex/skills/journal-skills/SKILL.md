---
name: journal-skills
description: An agent working on with no journal skill is told once per context window to load one
---

# The journal skill loaded

An agent working on with no journal skill is told once per context window to load one.

A session start or compaction opens a fresh window; triggers.skills sets how long the feature waits before its one reminder.

It listens to: agent.updated. It speaks every 25 uses. On by default; the viewer's Settings switches it per environment, and `triggers.skills` in the environment's settings tunes it.
