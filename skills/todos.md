---
name: journal-todos
description: File distinct future work as a to-do, declare work before writes, tell parked from blocked, and close both explicitly.
---

# To-dos and work

A distinct future task becomes `journal todo create` immediately when the user names it, before further investigation, implementation, or deferral. Put the user's evidence, scope and a starting point in its brief. Use `todo after` for another row, `todo block` for an external condition, and `todo ask` for a user decision. Auto mode takes the next ready row by priority.

Start with `journal todo start`; keep the work's log as you go — `journal work log <n> "<message>"` for every decision, turn and finding, with its reason. Twenty edits without a log entry hold your writes until you log. End the work with `journal work end`, then close the row with `journal todo done`. Never leave completion implicit.

## Parked and blocked

**Parked.** The row is in hand (its work was started) and nothing stops it, but something else goes first by choice: the user asked for something now, or another row matters more. `journal work park <n> "<what goes first>"` sets it aside; `journal work resume <n>` picks it up where it stopped. Only started work can be parked. A to-do that was never started is not parked: it waits on the list until it is taken.

**Blocked.** The row cannot go ahead until something else happens first:
- another to-do: `journal todo after <n> <m>` (it waits on row m, `--off` undoes);
- a decision or a conversation with the user: `journal todo ask <n> "<question>"`;
- anything outside: `journal todo block <n> "<why>"`, then `journal todo unblock <n>` once it has happened.

Auto mode skips a blocked row until what it waits on is done; a parked row stays yours to resume.

The test: could you pick it up right now if you chose to? Yes, it is parked. No, it is blocked. Never park what is stuck, and never block what you only put aside.
