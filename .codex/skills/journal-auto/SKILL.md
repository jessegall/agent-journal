---
name: journal-auto
description: The next ready row, by priority, offered on idle while nothing is open
---

# Auto mode

The next ready row, by priority, offered on idle while nothing is open.

Off by default: enabling it is the user's word to work the list and decide without blocking questions. A row is ready when it is not blocked, waits on no open row or question, and its plan's phase is current. Questions only the user can answer go through the journal so work can continue.

It listens to: agent.updated. It speaks on idle. Off by default; the viewer's Settings switches it per environment, and `triggers.auto` in the environment's settings tunes it.
