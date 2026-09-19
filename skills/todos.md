---
name: journal-todos
description: Park distinct future work as a to-do, declare work before writes, and close both explicitly.
---

# To-dos and work

A distinct future task becomes `journal todo add` immediately when the user names it, before further investigation, implementation, or deferral. Put the user's evidence, scope and a starting point in its brief. Use `todo after` for another row, `todo block` for an external condition, and `todo ask` for a user decision. Auto mode takes the next ready row by priority.

Start with `journal todo start`; keep the work's log as you go — `journal work log <n> "<message>"` for every decision, turn and finding, with its reason. Twenty edits without a log entry hold your writes until you log. End the work with `journal work end`, then close the row with `journal todo done`. Never leave completion implicit.
