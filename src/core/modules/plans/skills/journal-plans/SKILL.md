---
name: journal-plans
description: Build and follow a plan of ordered tasks; read it before the first plan command of a session, or when the user asks for a plan or a roadmap
---

# Plans

A plan is a goal, phases in order, and the tasks under each phase. You build it, mark it ready, the user approves it,
and then it is followed.

- `journal plan make "<title>" --brief "<goal>"` drafts it; `journal plan edit <n>` changes it.
- `journal phase make --plan <n> "<title>" --goal "<what is true when done>"` adds a phase; `--checkpoint` where the
  user should review before the plan goes on. `journal phase move <phase> --to <place>` reorders one.
- `journal phase place <task> --phase <phase>` puts a task at the end of a phase.
- `journal task make "<title>" --phase <phase>` makes a task at the end of that phase in one command. A missing phase
  or an ended plan refuses the command and leaves no new task.
- Write a plan thoroughly: split each phase into its real steps and file one task per step a person could check. Write
  each brief so it can be carried out alone: the files to change, what already does part of it and is reused, the
  stories to write first, the tests to run by name, and the proof that shows each point.
- `journal plan ready <n>` when every phase has its tasks. A phase with one task is refused until you give the reason one
  task is enough: `--skip-guard plans.one-task-phase --skip-reason "<why>"`. Only the user approves; `journal plan start <n>`
  begins it.
- A helper that makes a plan may also run `plan edit`, `phase edit`, `task edit` and `plan ready` on it.
- `journal plan outline <n>` lists its phases and tasks, `journal plan progress <n>` its counts,
  `journal plan inspect <n>` both, and `journal plan list` every plan.
- `journal plan block <n> --reason "<why>"` when one thing stops all of it; `journal plan unblock <n>` opens it.
- `journal plan cancel <n>` abandons it.

## How its tasks are handed out

A phase is finished first. Inside a phase the highest priority goes first, then the lowest number. Of several started
plans, the one started first goes first. A critical task outside the plan goes before all of it. A task waiting on
another does not hold its phase up; go on with the tasks that can be done.
