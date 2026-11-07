---
name: journal-memory
description: Keep what matters beyond the context window with weighted memories; read it before the first memory command of a session, or when the context reaches a mark
---

# Memory

A memory is something worth keeping in mind. It has a weight and it fades. Memories can go stale; remove one when it is no
longer true.

- `journal memory make "<what to keep in mind>" --weight 7` keeps one, in one or two plain sentences. A
  memory belongs to one environment. Every compaction lowers the weight of the memories in your own scope by one, and
  at weight 0 a memory is removed. A higher weight lasts through more compactions.
- What must keep applying is a rule, not a memory: see the journal-rules skill.
- A memory belongs to the agent that made it, and no other agent can see it: every main agent of an environment counts
  as one agent, and a worker or helper has its own. A worker or helper gets the project rules and its brief.
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
  The line says how many tool uses you have: by default 10 at 50 percent, 5 at 80 and 2 at 90. After them you are held
  until you do, and a stop waits for it too. Reads and journal commands still go through.
