---
name: journal-files
description: Every file a piece of work changes, and every commit made during it, is recorded on the work
---

# Files changed

Every file a piece of work changes, and every commit made during it, is recorded on the work.

The work's opening tree is its baseline; after a write, only paths changed since then are kept with their line counts. A script's writes count too.

It listens to: agent.updated, work.completed, work.created. It speaks on the events it listens to. On by default; the viewer's Settings switches it per environment, and `triggers.files` in the environment's settings tunes it.
