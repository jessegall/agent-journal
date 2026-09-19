---
name: journal-status
description: A message read and not answered for ten tool uses earns a private nudge to give the user a status update; at twenty the writes wait for a reply
---

# A status update owed

A message read and not answered for ten tool uses earns a private nudge to give the user a status update; at twenty the writes wait for a reply.

triggers.status sets the cadence (every 10 uses); status.patience (2) is how many nudges go unheeded before the hold. A reply, a reaction or processing the message settles it.

It listens to: agent.updated, message.created. It speaks every 10 uses. On by default; the viewer's Settings switches it per environment, and `triggers.status` in the environment's settings tunes it.
