---
name: journal-plans
description: A plan advances as its rows close: a phase completes, a checkpoint waits, the last phase ends it
---

# Plans

A plan advances as its rows close: a phase completes, a checkpoint waits, the last phase ends it.

Only the user activates a plan and continues it past a checkpoint; with the auto feature on, checkpoints are passed without waiting.

It listens to: todo.completed. It speaks on the events it listens to. On by default; the viewer's Settings switches it per environment, and `triggers.plans` in the environment's settings tunes it.
