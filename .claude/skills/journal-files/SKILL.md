---
name: journal-files
description: Every file a piece of work changes, and every commit made during it, is recorded on the work
---

# Files changed

Every file a piece of work changes, and every commit made during it, is recorded on the work.

After a write the changed paths are read from git and kept on the open work with their line counts; a script's writes count too.

It listens to: agent.updated. It speaks on the events it listens to. On by default; the viewer's Settings switches it per environment, and `triggers.files` in the environment's settings tunes it.
