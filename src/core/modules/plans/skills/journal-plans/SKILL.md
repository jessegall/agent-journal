---
name: journal-plans
description: Build and follow a plan of ordered tasks; read it before the first plan command of a session, or when the user asks for a plan or a roadmap
---

# Plans

A plan is a goal, phases in order, and the tasks under each phase. You build it, mark it ready, the user approves it,
and then it is followed.

- `journal plan make "<title>" --brief "<goal>"` drafts it; `journal plan edit <n>` changes it.
- `journal phase make --plan <n> "<title>" --goal "<what is true when done>"` adds a phase; `--checkpoint` where the
  user should look at before the plan goes on, and `--test "<command>"` for a test that runs at the phase's end.
  `journal phase move <phase> --to <place>` reorders one.
- `journal phase place <task> --phase <phase>` puts a task at the end of a phase.
- `journal task make "<title>" --phase <phase>` makes a task at the end of that phase in one command. The command is refused, and no
  task is made, when the phase is missing or the plan has ended.
- How thorough a plan is, is in the skill journal-planning, read before `plan make` and `phase make`.
- A planner scores and tags each task as it writes it. Read `journal task tags` first and reuse its words.
  Give each `journal task make` its `--complexity <1-5>` and repeated `--tag <word>` flags; the score anchors are in
  journal-tasks. Use `--confirm` for a new word. A read-only planner sets these on creation and cannot edit them later.
- `journal task depend <task> --on <other>` says what a task waits on; `journal task waits-on-nothing <task> --why "<why>"` says it
  truly waits on nothing. Every task but the plan's first states one or the other, or an agent is refused at `plan ready`.
- `journal plan ready <n>` when every phase has its tasks. A phase with one task is refused until you give the reason one
  task is enough: `--skip-guard plans.one-task-phase --skip-reason "<why>"`. Only the user approves; `journal plan start <n>`
  begins it.
- `journal plan assign <n> --to <agent>` reserves a plan's open and blocked tasks for that agent, a worker or the main agent, and
  `--phase <phase>` only those of one phase; `journal plan assign <n>` leaves them free for the main agent to pick. A
  person or the main agent runs it, also before the plan starts, and a later assign moves the open and blocked tasks again.
- A helper that makes a plan may also run `plan edit`, `phase edit`, `task edit` and `plan ready` on it.
- `journal plan outline <n>` lists its phases and tasks, `journal plan progress <n>` its counts,
  `journal plan inspect <n>` both, and `journal plan list` every plan.
- `journal plan block <n> --reason "<why>"` when one thing stops all of it; `journal plan unblock <n>` opens it.
- `journal plan cancel <n>` abandons it. When the user asks for something that makes a plan no longer right, cancel that plan
  yourself, at once and without asking.
- On each actual start or unblock, a main agent receives a pointer to `journal plan context <n>` and reads it
  before changing project files. Title edits do not begin a new execution episode; a replacement main agent
  reads the current episode even when the plan started earlier. A plan with no tasks still has context.
- Plan context includes bounded quoted messages and comments, with approval, design and report references.
  Follow its exact `--page`, `--message M --text-offset K` and `--ancestor-cursor TOKEN` continuations;
  read files through its returned `--message M --attachment "name"` command. These reads do not select a request.
  The first task's overview inherits its plan context; approval, checkpoints and task order still apply.

## How its tasks are handed out

A phase is finished first. Inside a phase the highest priority goes first, then the lowest number. Of several started
plans, the one started first goes first. A critical task outside the plan goes before all of it. A task waiting on
another does not hold its phase up; go on with the tasks that can be done.
