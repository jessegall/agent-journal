---
name: journal-task-cleanup
description: Follow the steps that sort the open tasks in no plan into covered, duplicate and still valid ones; read it when you are asked to clean up, group or cancel loose tasks
---

# Cleaning up loose tasks

A later task overrules an earlier one, never the other way round. A task made after another can change what was decided
or do its work, even when the later one was finished first. An older task never makes a newer one unnecessary, so work
that is done is never undone.

For each open task in no plan:

1. Compare it with the tasks made after it, finished or not, and with the plans made after it. If one of them does its
   work, changed the decision or already did it, the earlier task is covered: note which task covers it.
2. Compare it with older tasks only to find a plain duplicate of the same work.
3. A task that is neither covered nor a duplicate is still valid.

Then:

- List the loose tasks with `journal task list --state open`; a task in a plan shows its plan in `journal task show <n>`.
- File one report of the covered and the duplicate tasks, each with the task that covers it or repeats it, for the
  main agent to cancel. Cancel nothing yourself.
- Group the valid tasks into two plans, a third only when two cannot hold them. In each plan write what waits on what,
  then mark it ready with `journal plan ready <n>`.

How thorough a plan is lives in the skill journal-planning; the commands are in the skill journal-plans.
