---
name: journal-start
description: What a session is handed at its start, kept current on every change to the record
---

# The start block

What a session is handed at its start, kept current on every change to the record.

The hook hands the file over at SessionStart; nothing is computed inside the hook.

It listens to: *. It speaks on the events it listens to. On by default; the viewer's Settings switches it per environment, and `triggers.start` in the environment's settings tunes it.
