---
name: journal-memory
description: Keep what matters beyond the context window with weighted memories; read it before the first memory command of a session, or when the context reaches a mark
---

# Memory

A memory is something you must still know after a compaction. Every compaction lowers each of your memories by one,
and at 0 it is gone. A memory lasts only as long as you keep weighing it. A memory is at most 400 characters: anything
longer goes in a document the memory names.

A memory is yours alone: every main agent of an environment counts as one agent, and a helper has its own. A helper
gets the project rules and its brief.

## Make one

After everything that reaches you (a message, an answer, a report, a run that ends) ask whether you must still know it
after a compaction, and go down the ladder below for it. When you must, make the memory then, not later.

`journal memory make "<one or two plain sentences>" --weight <n>`. Write what to do and when, not what happened.
Always name where it came from: the message, task or report number, such as "user 121617". `--task <n>` ties it to a
task and `--keywords a,b` to words that bring it back.

When you promise something you cannot do yet, make the memory at once, weighed 9, naming who asked and what it waits on.

When the user names a time or an interval ("at five", "every hour", "tomorrow morning"), also set a reminder for that
time: `journal reminder make "<what to do>" --at <time>` or `--every-minutes <n>`. The memory keeps it in mind; the
reminder tells you when.

## Weigh them: the ladder

At every context mark, take each memory and go down this ladder. Stop at the first yes.

1. **Is it no longer true, or is it done?** Remove it: `journal memory remove <n> --reason "<why>"`.
2. **Must it hold forever, for every agent?** It is a rule: propose it with `journal rule make`. Keep the memory, weighed
   9, until the rule holds: approved by the user, or by itself when the project lets agents make rules without
   approval. Then remove the memory.
3. **Is it too big for one or two sentences?** A memory is at most 400 characters. An agreement with the user, a
   decision with its reasons or a list of steps goes whole in a document (`journal doc make`), and the memory only names
   it: "Agreement with the user on the memory skill: doc 1290." Then weigh that memory by the steps below.
4. **Is there something you must still do but cannot start yet?** The user asked it, another agent asked it, or it
   waits on a test run, a helper, a worker or a release ("when the tests pass, install"; "tell the plugin session when
   task 9733 lands"). Weigh it 9, every time, until it is done. Work you owe never fades.
5. **Will you need it later today?** Weigh it 7: it must outlast the work in hand.
6. **Do you need it for the work in hand?** Weigh it 5.
7. **Is it only nice to know?** Leave it alone and let it fade.

`journal memory weigh 3,7,9 9,7,5` gives each memory its own weight, in order. A weight is never lowered: a memory that
matters less is left to fade, or removed when it is no longer true. `journal memory edit <n>` corrects one that is
mostly true.

The mark says how many tool uses you have left: by default 10 at 50 percent, 5 at 80 and 2 at 90. After them you are
held until you weigh, and a stop waits for it too; reads and journal commands still go through. When nothing needs
keeping, say why with `journal memory skip "<why>"`.

## Read them

- `journal memory list` shows yours; `journal memory read <n>` reads one whole.
- `journal memory context` shows the memories you were given since your last compaction.
- `journal memory faded` shows what faded; `journal memory restore <n>` brings one back, with a weight.
