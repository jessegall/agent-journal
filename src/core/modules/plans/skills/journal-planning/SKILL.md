---
name: journal-planning
description: How thorough a plan is: real steps in each phase, one task per step, and a brief each worker can carry out alone; read it before you make a plan or a phase
---

# Planning a plan thoroughly

A plan is only as good as its tasks. Write it so a worker on a cheaper model who knows nothing else can take one task
and finish it without having to decide anything for itself.

- When your job names a functional design document, read it whole. Its goal, user stories and phases are your source:
  turn them into the plan, and do not design it again.

- Split each phase into its real steps. File one task per step a person could check.
- A phase with one task needs a reason. `journal plan ready` refuses it until you pass
  `--skip-guard plans.one-task-phase --skip-reason "<why one task is enough>"`; otherwise split the phase.
- Write each brief so it can be carried out alone: the files to change, what already does part of the work and is
  reused, the stories to write, the tests to run by name, and the proof that shows each point.
- Point at code with an excerpt or `file:line`. Never put whole code in a task: the worker writes the code.
- Order the phases so each one leaves the project working, and put a checkpoint where the user should look.
- A phase runs without tests until its end, so keep phases small: a mistake early in a phase is found only there.

The commands are in the skill journal-plans.
