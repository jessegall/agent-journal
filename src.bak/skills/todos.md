---
name: journal-todos
primary: true
description: File distinct future work as a to-do, declare work before writes, tell parked from blocked, and close both explicitly.
---

# To-dos and work

## When the user asks for work

1. **It is the current work**, a step of it, or a correction: carry on; `journal work log <n> "<what moved, and why>"` when the direction changes.
2. **It is different.** A to-do — the default: `journal todo create "<title>" --brief "<why, where to start>"`, say "filed as to-do n", and carry on. Its words: `journal todo ask <n> "<question>"` files a question on the row and the row waits; `todo answer <n> "<text>"` answers it; `todo block <n> "<why>"` / `todo unblock <n>`; `todo after <n> <m>` says it waits on row m (`--off` undoes); `todo strike <n> "<why>"` abandons it on the record; `todo start <n>` opens work for it; `todo prune --days 30` drops long-closed rows. The list is ordered by priority, then number: `journal todo priority <n> low|default|high|critical` (or a number; 100 is default). You assign priority yourself when urgency, impact, dependencies or risk make a difference, and revise it when the evidence changes; an explicit user priority always overrides that judgment.
   File it immediately, before looking at files, investigating, implementing, or deferring it. If one message mixes current-work steering with a distinct future request, apply the steering to the open work and file the distinct request first.
3. **It is different and the user said NOW** — their word, not your judgement: update the open work with where it got to, then start the new one.

With nothing open, the request is the work: read until you can name it, `journal work start "<the work>"`, go. **Declare before the first write**: a write with no work open is refused by the gate. `journal todo start <n>` opens work for a row; `journal work end <n> --how "<what landed>"` ends it, and the row is closed only by `journal todo done <n> --how "<how>"` — ending work is not finishing a row. `journal work log <n> "<message>"` writes a dated entry in the work's log — every decision, turn and finding as it happens; twenty edits without an entry hold your writes until you log. `work update` only renames or rewords the work itself. A commit closes a row when its message carries `Journal: todos done <n>` at column 0.

**"I'll do it after this" is a to-do, every time.** The deferral feature names the sentence back to you if nothing was filed.

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
