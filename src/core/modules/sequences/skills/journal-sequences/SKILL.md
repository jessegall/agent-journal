---
name: journal-sequences
description: Follow a sequence of steps one at a time; read it when a sequence is run or written
---

# Sequences

Steps followed in order, one at a time. A running sequence stays with you through tasks and new sessions until its
last step is done.

- `journal sequence run <n>` starts one and tells you step 1; `journal sequence-run list` shows the runs still going.
- `journal sequence follow` takes the step in hand up. Until you do, writes and commands wait; reads and journal
  commands go through.
- `journal sequence next` when the step is done: you are given the next one, or that the sequence ended.
- `journal sequence abandon --why "<why>"` names the steps it would leave undone; again with `--sure` it gives the run up.
- `journal sequence make "<title>" --steps "first | second | third"` writes one, `journal sequence edit <n>` changes it,
  and `journal sequence show <n>` lists its steps.
- `journal sequence list` shows every sequence with its number of steps.
- A step can list checks in `--step-guards`, such as `[{"checks": [3]}]` for step 1. `journal sequence next` is refused
  until each listed check last passed, for a step and for the last step that ends the sequence: run
  `journal check run <n>`, put right what it finds, then `next` again. `journal sequence abandon` ignores checks.
