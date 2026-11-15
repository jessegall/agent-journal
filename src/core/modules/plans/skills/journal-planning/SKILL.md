---
name: journal-planning
description: Build a thorough plan with real steps in each phase, one task per step, and a brief that can be carried out alone; read it before you make a plan or a phase
---

# Planning a plan thoroughly

A plan is only as good as its tasks. Write it so a worker on a cheaper model who knows nothing else can take one task
and finish it without having to decide anything for itself.

- When your job names a functional design document, read it whole. Its goal and phases are your source: turn them
  into the plan, and do not design it again. Its user stories say how the system must behave; they are not tasks.
- Plan the steps of the change, never its tests: no story books and no test tasks. Which tests to write is the user's
  to decide.

- Split each phase into its real steps. File one task per step a user could check.
- A phase with one task needs a reason. `journal plan ready` refuses it until you pass
  `--skip-guard plans.one-task-phase --skip-reason "<why one task is enough>"`; otherwise split the phase.
- Write each brief so it can be carried out alone: the files to change, what already does part of the work and is
  reused, and when the step is done, in what the user can check.
- Phases are done in order, but the tasks inside a phase, and the waits between phases, run in whatever order the work
  allows: a plan is not a chain. The phase order already keeps a later phase back, so never make a task wait only to keep
  the list in order. A task waits on another only when it truly needs that task's result.
- For every task, go down this ladder and stop at the first yes:
  1. Does it need code, a file, a table, a command or a decision that another task makes? It depends on exactly that
     task: `journal task depend <task> --on <other>`. Name the task that makes it, never simply the task above it.
  2. Does it need several such pieces? It depends on each of those tasks, and on nothing else.
  3. Would it change the same lines as another task of the same phase, so the two would clash if worked at once? It
     depends on one of them, and says so in its brief.
  4. Otherwise it waits on nothing: `journal task waits-on-nothing <task> --why "<why>"`, for example "phase order is
     enough" or "a separate file". Tasks that wait on nothing can be worked at the same time.
  Every task but the plan's first says one or the other, or `journal plan ready` refuses the plan. A loop of waits is
  always refused.
- Point at code with an excerpt or `file:line`. Never put whole code in a task: the worker writes the code.
- Order the phases so each one leaves the project working, and put a checkpoint where the user should look.
- A phase runs without tests until its end, so keep phases small: a mistake early in a phase is found only there.

The commands are in the skill journal-plans.
