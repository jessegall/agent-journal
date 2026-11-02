---
name: journal-memory
description: Keep what matters beyond the context window with weighted memories; read it before the first memory command of a session, or when the context reaches a mark
---

# Memory

What you keep in mind lasts only as long as you keep judging it worth keeping.

- `journal memory make "<what to keep in mind>" --type fact --weight 7` keeps one, in one or two plain sentences. Every
  compaction lowers every weight by one, and at nought the memory is no longer shown.
- `--task <n>` ties it to a task, `--due "<time>"` to a moment, `--keywords a,b` to words that bring it back.
- `journal memory list` names every memory; `journal memory read <n>` reads one whole.
- `journal memory weigh 3,7,9 5,8,2` gives each memory its own weight, in order; `journal memory weigh 3,7,9 5` gives
  them all one. Keep or raise a weight, never lower it to forget a stale detail.
- `journal memory edit <n>` corrects one that is mostly true; `journal memory remove <n>` takes out one that no longer is.
- `journal memory context` shows the memories you were given since your last compaction, and
  `journal memory faded` those that reached nought.
- At each context mark you weigh your memories, or say why nothing needs keeping with `journal memory skip "<why>"`.
  Reads and journal commands go through until you do.
