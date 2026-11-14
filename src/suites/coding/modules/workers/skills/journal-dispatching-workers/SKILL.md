---
name: journal-dispatching-workers
description: Send a worker to write a bounded job, check its proofs and merge its work; read it before dispatching one
---

# Dispatching workers

A worker is a helper that writes: it works in a worktree on its assigned tasks, each with its own brief. A stopped worker
stays kept on the same agent number and session until retired.

## Sending

- Read each task to delegate with `journal task info <n>`, not its whole brief: open the brief only when the title and facts are not enough.
  Every worker dispatch names its model with `--model <model>`, or `--model default` for the profile's own; a dispatch without `--model` is refused, also with a `--tier`. Each start chooses the least expensive model that reliably fits the work (the journal's law L1); inheriting your own model is not a choice. A worker writes code, so it never runs on the fast tier.
- Choose the profile from what the job is, before the model. A job that only reads goes to a read-only helper, never a worker:
  research and checks to `journal-researcher`, a review to `journal-code-reviewer`, tracing a fault to `journal-debugger`, a
  design to `journal-planner`. A job that writes goes to a worker: `journal-worker-medior` for a change the brief states,
  `journal-worker-senior` for one that needs judgement. A task titled check, find out or investigate is a reading job. Never send a
  task to a worker only to clear the notice that a place is free: say why not instead.
- Choose the model first: the least expensive one that fits the job. Reuse a kept worker only when it is on that model,
  and never because a stronger one happens to be there. When no kept worker on that model is idle and no place is free,
  retire a finished worker yourself, then start one on the simpler model.
- Name a worker by the number `journal agent list` shows beside it here; a row id is refused.
- Give new work to a kept worker on that model that can take it, even when the subject changes; prefer the one that already knows
  the work. `journal worker send <number> --task <task> [<task> ...]` assigns its next tasks. A kept worker can take them on
  its open worktree; after its work is merged, a send creates a new worktree in its old folder on the same session.
  What it already committed and its proofs stay recorded. An unmerged branch is never overwritten.
- `journal worker dispatch <task> [<task> ...] --tier general` starts a worker on the tasks; `--profile` is a checked worker profile, journal-worker by default, whose text the worker starts from. `--tier fast|general|strongest` chooses the model of the selected program; with no tier, the profile chooses it. `--model <model>` names one exact model (`--name` shows on its card). It starts its tasks itself, several at once if it likes, and commits them as it proves them, with no report in
  between; outside a plan the journal runs the tests of each commit and tells you when the last passes. `--library-link <folder>` links a folder such as
  `.venv` into its worktree and `--library-copy <folder>` copies it. `--program <program>` names the agent program.
- Each dispatched worker gets the test commands the journal finds in the project's manifests (package.json, pyproject.toml,
  go.mod, composer.json, Cargo.toml and the like, never in a library folder), read again at every dispatch, with a user's
  `preset-test-commands` setting in place of a found one of the same name. `journal worker presets` lists the manifests,
  their languages and those commands. Add `--test-command <name>=<command>` only for a command they lack; with none found
  or preset, an agent's dispatch names at least one.
- `journal worker dispatch --plan <plan> [--phase <phase>] --tier strongest` hands a worker the available tasks of an approved or
  started plan, or of one phase of it, in the plan's order. Use `journal worker send <number> --plan <plan> [--phase <phase>]`
  to give the same work to a kept worker. The plan is assigned to the worker and shows so on the plan and on the agent. The worker works it to its end, asks for the merge itself with `journal worker ask-merge`, and you hear from it at the merge. A dispatch or send of several tasks is one unit in the same way.
  Completed, started and already assigned tasks are left alone.
- Any blocked task can go to a worker, alone, in a phase or in a whole plan: it stays assigned while it waits, and the
  worker takes it when it opens, sent to it at once when the worker is idle. A new worker given only blocked tasks is made and not started; it starts by itself when one of them opens.
- A worker's plan runs the tests of each checkpoint on the worker's own commit, in the background; you hear nothing until the worker's unit is merged. A proof with no test in a
  started plan needs no check from you; you can still read it and send it back. A worker out of test runs asks with `journal worker ask --about tests`; the merger or the journal settles it, and a
  question nobody answers in time comes to you. `journal helper grant <number> <program> "<subcommands>" "<arguments>"` says what it may run, alternatives split by a bar; it runs that with
  `journal helper run <program> ...`, and a later grant for the same program replaces the earlier one. To decline, grant nothing.
- Give a worker many tasks at once: that runs long and bothers you less than many small dispatches.
- `journal worker models` lists each program's models from the cheapest to the strongest.
- With no program flags, a dispatch follows the first matching route, then the split, then your own program.
  `journal worker split --task <task>` previews the program, model and reason without starting anything.
  `journal worker-route list` shows the routes in order. A route tests all its tags and its complexity range together.
- A strict route waits when its program is out. Read the reason and end time in the refusal. A route that needs a
  missing score names `journal task edit <task> --complexity <1-5>`; score it before dispatching. A dispatch whose tasks
  choose different programs must be split as its refusal names; use `--phase` for a suitable part of a plan.
- An agent cannot override the program of a ready route by naming another. After that refusal, an authorized exception
  uses `--skip-guard workers.route-holds --skip-reason "<why>"`. The skip and its reason stay in the log and a chat mark.
  A user can choose any program. An agent cannot change a route a user made.
- Only a user changes the split and its plan-window threshold. Ask with `journal setting request` when it needs
  changing. A helper changes neither routes nor program outages, and a worker dispatches no workers.
- `journal worker send <number> "<job>"` adds instructions to a kept worker's existing work. Use `--task` for new assigned
  tasks. A dispatch is refused when a compatible idle worker can take those tasks. Use `--fresh "<why>"` on dispatch
  only when a separate session is needed; its reason stays with the new worktree.
- `journal worker merge <number> --up-to <task or commit>` takes in the worker's handed-in tasks up to that point while it goes on with its next ones; their proofs must be checked first, and its later merge brings only the rest.
- `journal worker dispatch --take-over <number> --tier <tier>` starts a fresh worker, on its profile as it is now, in
  the place of a stopped worker: it takes over that worker's open worktree with its commits, proofs and files, the tasks
  it held and its plan, and goes on where it stopped. Then retire the stopped worker.
- `journal agent retire <number> --reason "<why>"` retires a stopped worker or helper for good, at once: managing agents
  is the main agent's job, so it asks no one. Any other agent is refused. A retired worker retains its history and transcript but
  can never resume or receive another job. Dirty files or unmerged work prevent retirement; settle
  them first. Reporting, committing, merging and stopping a process do not by themselves retire the agent.
- Read each proof with `journal proof list --task <n>`, check it with `journal proof check <n>` or send it back with
  `journal proof short <n> "<what is missing>"`.
- Read each completed task with `journal worker logs <number>` after its latest commit: a task's outcome, its important
  lines whole and its other lines by their first words. `--task <n>` prints one task whole; open one that looks wrong.
- An important line is one the worker marked, a difference it stated at its commit, or one the journal wrote when a task
  failed its commits or a test failed over and over in the worker's own runs. A merge with such lines needs your
  answer: `journal worker merge <number> --read-important "<what you make of them>"`.
- A worker on a unit of several tasks asks for its own merge; `journal merger next` shows the ask and its note. Do not merge such a worker before it asks.
- Take the work in with `journal worker merge <number>` once every point is checked; nothing else adds a worker's work.
  Merging a worker's work is the main agent's own decision, never a question for the user: when the merge command
  cannot reach finished work (a branch kept after its worktree was removed), run its tasks' tests and merge that branch
  yourself.
  It first merges the branch into the worktree. When only built files under `web/dist` clash it keeps the branch's:
  rebuild after it. A clash in source goes back to the worker with conflict markers to settle.
- What a worker needs to go on is the main agent's own decision, never a question for the user: give it test commands
  with `journal worker send <number> --test-command <name>=<command>` and link a missing folder with `--library-link`, then
  tell the user only if it matters.
- `journal worker release <number> "<why>"` puts its task back to open.
- `journal worker sandbox <number> on|off` sets whether that worker runs its shell lines in the sandbox, over the project setting
  `worker-sandbox`; `journal worker dispatch` and `send` take `--no-sandbox` to start it with the sandbox off. A user or the
  main agent switches it; a helper cannot.

## Keeping the right mix

Keep a mix that matches the work, and read `journal agent mix` before retiring: it prints the jobs of each kind of agent by
model lately, the agents kept and how long they have been idle. Prefer retiring the agent idle the longest on the model with
the most spare agents; one that knows the work coming next is worth keeping. A start refused for no free place names the
idle worker that can take the job, or tells you to retire one first. The journal itself retires no agent.

## Running and kept limits

`journal agent limits --environment <name>` shows the running and kept counts and limits in force. A running limit
counts simultaneous worker processes; a kept limit counts both running and idle workers until retirement. Running 0
allows none to start; kept 0 means no limit. Lowering a kept limit never removes a worker. Retire an unused worker
explicitly to free a kept place.

Only a user changes the limits, through the agents window or settings. Environment values override project values;
numbers written in a profile file have no effect. Read-only helpers have their own limits per profile. To add instructions to
a busy read-only helper's current job, use `journal helper send <number> --steer "<text>"`; give separate work to an idle one.

## Waiting on a worker

`journal task block <n> --on worker:<number>` opens when that worker is merged, released or ended. Pending
tests, corrections and queued tasks keep it blocked. A crashed worker is detected on a tick; one that
never starts is ended after the idle time; no worker is retired unless a user does it.
