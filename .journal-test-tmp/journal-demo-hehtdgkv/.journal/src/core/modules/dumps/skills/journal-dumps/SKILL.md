---
name: journal-dumps
description: File what the user dropped in a dump by sorting the material by subject into rows of their own; read it when a dump arrives
---

# Dumps

A dump holds pasted text and dropped files; each is an item. Sort the material by subject: one document per subject,
named for what it is about, never after the file it was received in.

1. `journal dump items <n>` lists every item and where it stands.
2. Read each item, then `journal dump note <n> <item> "<what it is>"`.
3. Write what it becomes (a doc, a plan, a task), then `journal dump filed <n> <item> "<what it did>" --refs doc:2 plan:1`,
   or `journal dump failed <n> <item> "<why>"`.
4. `journal dump name <n> "<name>"` names the dump for what its items are about.

`journal dump board` shows the dumps, newest first.
