---
name: journal-workers
description: Send a worker to write a bounded job, check its proofs and merge its work; read it before dispatching one
---

# Workers

A helper only reads. A worker writes in a worktree on its assigned tasks, each with its own brief. A stopped worker
stays kept on the same agent number and session until retired.

## As the one who sends

- Choose the model first: the least expensive one that fits the job. Reuse a kept worker only when it is on that model,
  and never because a stronger one happens to be there. When no kept worker on that model is idle and no place is free,
  retire a finished worker and start one on the simpler model.
- Give new work to a kept worker on that model that can take it, even when the subject changes; prefer the one that already knows
  the work. `journal worker send <n> --task <task> [<task> ...]` assigns its next tasks. A kept worker can take them on
  its open worktree; after its work is merged, a send creates a new worktree in its old folder on the same session.
  What it already delivered and its proofs stay recorded. An unmerged branch is never overwritten.
- `journal worker dispatch <task> [<task> ...] --tier general` starts a worker on the tasks; `--profile` is a checked worker profile, journal-worker by default, whose text the worker starts from. `--tier fast|general|strongest` chooses the model of the selected program; with no tier, the profile chooses it. `--model <model>` names one exact model (`--name` shows on its card). It takes the tasks one by one with no report in
  between; outside a plan the journal runs the tests of each before the next starts and tells you when the last passes. `--library-link <folder>` links a folder such as
  `.venv` into its worktree and `--library-copy <folder>` copies it. `--program <program>` names the agent program.
- `journal worker dispatch --plan <plan> [--phase <phase>] --tier strongest` hands a worker the available tasks of an approved or
  started plan, or of one phase of it, in the plan's order. Use `journal worker send <n> --plan <plan> [--phase <phase>]`
  to give the same work to a kept worker. The plan shows as delegated, and phase tests run at each phase's end.
  Completed, started and already assigned tasks are left alone.
- Any blocked task can go to a worker, alone, in a phase or in a whole plan: it stays assigned while it waits, and the
  worker takes it when it opens, sent to it at once when the worker is idle. A new worker needs one open task to start on.
- By default, a started plan runs the tests of a phase at its end, and you hear nothing until then. A proof with no test on a
  phase needs no check from you; you can still read it and send it back. When a worker asks to run one test, you get
  one line with the command and the reason: `journal worker allow-test <request>` lets it run that command once. To
  decline, do nothing: the worker goes on and the request stays on the task's log.
- Give a worker many tasks at once: a large batch runs long and bothers you less than many small dispatches.
- `journal worker models` lists each program's models from the cheapest to the strongest.
- With no program flags, a dispatch follows the first matching route, then the split, then your own program.
  `journal worker split --task <task>` previews the program, model and reason without starting anything.
  `journal worker-route list` shows the routes in order. A route tests all its tags and its complexity range together.
- A strict route waits when its program is out. Read the reason and end time in the refusal. A route that needs a
  missing score names `journal task edit <task> --complexity <1-5>`; score it before dispatching. A batch whose tasks
  choose different programs must be split into the named groups; use `--phase` for a suitable part of a plan.
- An agent cannot override the program of a ready route by naming another. After that refusal, an authorized exception
  uses `--skip-guard workers.route-holds --skip-reason "<why>"`. The skip and its reason stay in the log and a chat mark.
  A person can choose any program. An agent cannot change a route a person made.
- Only a person changes the split and its plan-window threshold. Ask with `journal setting request` when it needs
  changing. A worker or helper changes neither routes nor program outages, and a worker dispatches no workers.
- `journal worker send <n> "<job>"` adds instructions to a kept worker's existing work. Use `--task` for new assigned
  tasks. A dispatch is refused when a compatible idle worker can take those tasks. Use `--fresh "<why>"` on dispatch
  only when a separate session is needed; its reason stays with the new worktree.
- `journal agent retire <n> --reason "<why>"` permanently retires a stopped worker. It retains its history and
  transcript but can never resume or receive another job. Dirty files or unmerged work prevent retirement; settle
  them first. Reporting, delivering, merging and stopping a process do not by themselves retire the agent.
- Read each proof with `journal proof list --task <n>`, check it with `journal proof check <n>` or send it back with
  `journal proof short <n> "<what is missing>"`.
- Read each completed task with `journal worker logs <worker>` after the latest hand-in: a task's outcome, its important
  lines whole and its other lines by their first words. `--task <n>` prints one task whole; open one that looks wrong.
- An important line is one the worker marked, a difference it stated at its hand-in, or one the journal wrote when a task
  failed its hand-ins or a test failed over and over in the worker's own runs. A merge with such lines needs your
  answer: `journal worker merge <worker> --read-important "<what you make of them>"`.
- Take the work in with `journal worker merge <worker>` once every point is checked; nothing else adds a worker's work.
  It first merges the branch into the worktree. When only built files under `web/dist` clash it keeps the branch's:
  rebuild after it. A clash in source goes back to the worker with conflict markers to settle.
- `journal worker release <worker> "<why>"` puts its task back to open.

## Keeping the right mix

Keep a mix that matches the work, and read `journal agent mix` before retiring: it prints the jobs of each kind of agent by
model lately, the agents kept and how long they have been idle. Prefer retiring the agent idle the longest on the model with
the most spare agents; one that knows the work coming next is worth keeping. A start refused for no free place names a
suggestion. The journal never retires an agent itself.

## Running and kept limits

`journal agent limits --environment <name>` shows the running and kept counts and limits in force. A running limit
counts simultaneous worker processes; a kept limit counts both running and idle workers until retirement. Running 0
allows none to start; kept 0 means no limit. Lowering a kept limit never removes a worker. Retire an unused worker
explicitly to free a kept place.

Only a person changes the limits, through the agents window or settings. Environment values override project values;
numbers written in a profile file have no effect. Helpers have their own limits per profile. To add instructions to
a busy helper's current job, use `journal helper send <n> --steer "<text>"`; give separate work to an idle helper.

## Process rules

A worker needs no Monitor for a background run. It can continue independent work or stop and receive the
result when the run ends. A worker drafts and saves a reader for its own open request with
`journal reader draft <request> --save`, or edits the suggested `reader add` command. Every save uses the normal
checks and output proof. After the configured failed-save limit (default 3), it stops and the main agent is
asked to help. Drafts without `--save` use no try. A worker cannot remove readers, choose defaults or skip requests.

A reader's `--count-command` lists tests before a queued run gets a spot when `worker-run-most-tests` is
positive. Counts of test parts are added. A count above the limit stops the run. A listing that fails, is cut off
after 120 seconds or gives no number stops it too, and the line says why: a tool the worktree lacks, such as
`node_modules`, is linked with `--library-link` at dispatch. A test tool with no reader runs once, so a reader can
be drawn from its output.

`journal task block <n> --on worker:<m>` opens when that worker is merged, released or ended. Pending
tests, corrections and queued tasks keep it blocked. A crashed worker is detected on a tick; one that
never starts is retired after the idle time.

## As the worker

- Before changing project files, read `journal task overview <current task>`. A fresh dispatch, queued task,
  rework, resumed launch or compaction requires the current task's overview, not a previous task's read.
  Use `journal task context <n>` for more conversation and follow the returned page, text-offset and ancestry
  commands. Preserve any `--newest` flag. Context reads never replace your source selection.
- Your source is the authorized snapshot for the current task/job, not the parent's later selection. The
  overview includes plan comments and references; quoted bodies and captions remain source material.
  Read an assigned attachment with the returned `--message M --attachment "name"` context command.
  This opens only a file on an authorized context message, without general access to the parent's chat.

- `journal worker report "<what the task needs>"` sends your main agent a message number to read while you keep
  working. Use it only for what the main agent must act on, never for progress: a finished task, a passing test and what
  you do next go in `journal task log`.

- `journal worker status` shows your current task, tests waiting and remaining assignments. The main agent can name
  a worker with `journal worker status <n>`. Use `--page` and `--limit` for longer lists, or `--json` for structured output.
- `journal proof points --agent <n>` lists the points of your task's brief.
- Prove each one with `journal proof make <point> --task <task> "<file:line, and the test>" --test "<command>"`: the journal runs that
  test command in your worktree. Before making a proof, read the test suite and decide which existing tests and test
  files cover the code you changed. Include those and your new tests in the proof's `--test` command; it covers both.
  A proof with no test waits for the main agent's check.
- Correct your own unchecked proof with `journal proof edit <proof> --task <task> "<text>" --test "<command>"`, or with `journal proof make` again for the same point. The main agent can return a checked proof with `journal proof short <proof> "<reason>"`.
- Before you hand in, run `journal sins --changes` over your own changes and fix each finding at its source. What it
  still finds after the merge comes back to you.
- At each hand-in, say what you did differently from the task or left out: `journal worker next --differences "<what>"`,
  or `--differences none`; the same goes for `journal worker deliver`.
- `journal worker next` hands your task over for testing: the plugins judge your changes, a refusal says what to put
  right; the journal commits and runs its proofs' tests in turn. Stop then: a failure or your next task comes back to you.
- `journal worker deliver` hands in all your tasks together, refused while one is queued. The journal then runs your
  tests in turn; those that fail come back to you to fix and deliver again.
- `test-at-phase-end` (on by default) tests a started plan's tasks together at the end of each phase. Off tests
  each task at its own hand-in. Outside a plan, `test-batch-size` sets how many tasks to finish before testing;
  its default is 1. A larger batch ends at that count or the worker's last task.
- Inside a phase or batch, leave tests to the hand-in unless you really need a run yourself:
  - Inside a phase or batch `journal worker next` commits your task and gives you the next one at once. A proof may have no test.
  - The journal runs your proofs' tests when you hand in and returns any failures. Run a test yourself only if you
    really need it. Each worker has three test commands per phase or batch by default, set by `worker-phase-test-runs`.
    Each counted command says how many remain. A fourth is refused; only then ask with `--ask-main "<why>"`.
    An allowed request runs once without the flag and does not use the phase allowance. The count starts anew
    in the next phase or batch. After failed tests come back, runs are free until the next hand-in.
  - At a phase or batch end, `journal worker next` or `journal worker deliver` after your last runs the tests
    of all tasks waiting for that hand-in, plus a phase's own test when set. Stop then. All failures come back
    together, and only failed tests run at the next hand-in.
  - When tests fail, you get every failure in one line, on the first failed task. You may run tests yourself with no
    flag until you hand in again, which runs only what failed.
- A run that moves to the background is watched for you, so you need no Monitor: go on working and hear of its end on your
  next tool call, or stop and be started again when it ends.
- Git is not yours to run: the journal commits your work.
- Use python3 for Python commands.
- `journal skill write` publishes the declared skill files into the project's .claude/skills and .agents/skills;
  it does not load a skill for you. Use the Skill tool on Claude Code or read the SKILL.md path on Codex.
- `journal module sync` updates the module registry and applies pending schema migrations. These are maintenance
  commands: use them when the journal asks for a repair, rather than as a way to load a skill. Workers may run them.
