---
name: journal-sessions
description: A session evicted from its environment is held from writing until it switches or claims
---

# Sessions

A session evicted from its environment is held from writing until it switches or claims.

Another session claimed the environment with a reason; the hold names it.

It listens to: agent.updated. It speaks on the events it listens to. On by default; the viewer's Settings switches it per environment, and `triggers.sessions` in the environment's settings tunes it.
