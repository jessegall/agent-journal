---
name: journal-context
description: At each mark of the context window the agent decides — pin, rule or nothing — before any other write
---

# The context decision

At each mark of the context window the agent decides — pin, rule or nothing — before any other write.

The marks are the trigger's at list; a pin, a rule, or journal nothing "<why>" releases the hold.

It listens to: agent.updated, pin.created, rule.created. It speaks at 50, 70, 90, 95 percent of the context. On by default; the viewer's Settings switches it per environment, and `triggers.context` in the environment's settings tunes it.
