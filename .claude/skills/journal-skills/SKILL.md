---
name: journal-skills
description: An agent working on with no journal skill in its window is told once, every so many tool uses, to load one
---

# The journal skill loaded

An agent working on with no journal skill in its window is told once, every so many tool uses, to load one.

A compaction empties the window; the skills in it are read from the transcript. triggers.skills sets the cadence (every 25 uses).

It listens to: agent.updated. It speaks every 25 uses. On by default; the viewer's Settings switches it per environment, and `triggers.skills` in the environment's settings tunes it.
