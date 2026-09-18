---
name: journal-commits
description: A commit whose message carries Journal: todos done <n> closes that row
---

# Commits

A commit whose message carries Journal: todos done <n> closes that row.

The trailer starts at column 0; prose and indented examples close nothing.

It listens to: agent.updated. It speaks on the events it listens to. On by default; the viewer's Settings switches it per environment, and `triggers.commits` in the environment's settings tunes it.
