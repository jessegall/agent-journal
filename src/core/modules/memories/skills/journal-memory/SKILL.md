---
name: journal-memory
description: Keep what matters beyond the context window with weighted memories; read it before the first memory command of a session, or when the context reaches a mark
---

# Memory

Use a fact by default for something worth remembering. Facts can go stale; remove one when it is no longer true.

- `journal memory make "<what to keep in mind>" --type fact --weight 7` keeps one, in one or two plain sentences. Every
  compaction lowers the weight of facts in your own scope by one. At weight 0 the fact is removed.
  A higher weight lasts through more compactions. Project-wide memories do not fade.
- Rules are rare user instructions that must keep applying. Rules do not fade; do not turn stale facts into rules.
- `--task <n>` ties it to a task and `--keywords a,b` to words that bring it back. Something to be told at a time or on an
  interval is a reminder, not a memory: `journal reminder make`.
- `journal memory list` names every memory; `journal memory read <n>` reads one whole.
- `journal memory weigh 3,7,9 5,8,2` gives each memory its own weight, in order; `journal memory weigh 3,7,9 5` gives
  them all one. Keep or raise a weight, never lower it to forget a stale detail.
- `journal memory edit <n>` corrects one that is mostly true; `journal memory remove <n>` takes out one that no longer is.
- `journal memory context` shows the memories you were given since your last compaction, and
  `journal memory faded` those removed after fading to weight 0. To bring one back, restore it with
  `journal memory restore <n>` and give it a positive weight.
- At each context mark you weigh your memories, or say why nothing needs keeping with `journal memory skip "<why>"`.
  Reads and journal commands go through until you do.
