---
name: journal-workers
description: Send a worker to write a bounded job, check its proofs and merge its work; read it before dispatching one
---

# Workers

A helper only reads. A worker writes in a worktree on its assigned tasks, each with its own brief. A stopped worker
stays kept on the same agent number and session until retired.

## As the one who sends

- Give new work to a kept worker that can take it, even when the subject changes; prefer the one that already knows
  the work. `journal worker send <n> --task <task> [<task> ...]` assigns its next tasks. A kept worker can take them on
  its open worktree; after its work is merged, a send creates a new worktree in its old folder on the same session.
  What it already delivered and its proofs stay recorded. An unmerged branch is never overwritten.
- `journal worker dispatch <task> [<task> ...] --model <model>` starts a worker on the tasks; `--profile` is a checked worker profile, journal-worker by default, whose text the worker starts from, and `--model` falls back to that profile's model (`--name` shows on its card), which it takes one by one with no report in
  between; outside a plan the journal runs the tests of each before the next starts and tells you when the last passes. `--library-link <folder>` links a folder such as
  `.venv` into its worktree and `--library-copy <folder>` copies it. `--program <program>` names the agent program.
- `journal worker dispatch --plan <plan> [--phase <phase>] --model <model>` hands a worker the open tasks of an approved or
  started plan, or of one phase of it, in the plan's order. The plan then shows as delegated, with each task's agent named.
- On a started plan the tests of a phase run at its end, and you hear nothing until then. A proof with no test on a
  phase needs no check from you; you can still read it and send it back. When a worker asks to run one test, you get
  one line with the command and the reason: `journal worker allow-test <request>` lets it run that command once. To
  decline, do nothing: the worker goes on and the request stays on the task's log.
- Give a worker many tasks at once: a large batch runs long and bothers you less than many small dispatches.
- `journal worker models` lists each program's models from the cheapest to the strongest.
- `journal worker send <n> "<job>"` adds instructions to a kept worker's existing work. Use `--task` for new assigned
  tasks. A dispatch is refused when a compatible idle worker can take those tasks. Use `--fresh "<why>"` on dispatch
  only when a separate session is needed; its reason stays with the new worktree.
- `journal agent retire <n> --reason "<why>"` permanently retires a stopped worker. It retains its history and
  transcript but can never resume or receive another job. Dirty files or unmerged work prevent retirement; settle
  them first. Reporting, delivering, merging and stopping a process do not by themselves retire the agent.
- Read each proof with `journal proof list --task <n>`, check it with `journal proof check <n>` or send it back with
  `journal proof short <n> "<what is missing>"`.
- Read each completed task and its log with `journal worker logs <worker>` after the latest hand-in.
- Take the work in with `journal worker merge <worker>` once every point is checked; nothing else adds a worker's work.
  It first merges the branch into the worktree. When only built files under `web/dist` clash it keeps the branch's:
  rebuild after it. A clash in source goes back to the worker with conflict markers to settle.
- `journal worker release <worker> "<why>"` puts its task back to open.

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
  working. Use it for a report or a request that does not require stopping.

- `journal worker status` shows your current task, tests waiting and remaining assignments. The main agent can name
  a worker with `journal worker status <n>`. Use `--page` and `--limit` for longer lists, or `--json` for structured output.
- `journal proof points --agent <n>` lists the points of your task's brief.
- Prove each one with `journal proof make <point> --task <task> "<file:line, and the test>" --test "<command>"`: the journal runs that
  test command in your worktree. A proof with no test waits for the main agent's check.
- Correct your own unchecked proof with `journal proof edit <proof> --task <task> "<text>" --test "<command>"`, or with `journal proof make` again for the same point. The main agent can return a checked proof with `journal proof short <proof> "<reason>"`.
- `journal worker next` hands your task over for testing: the plugins judge your changes, a refusal says what to put
  right; the journal commits and runs its proofs' tests in turn. Stop then: a failure or your next task comes back to you.
- `journal worker deliver` hands in all your tasks together, refused while one is queued. The journal then runs your
  tests in turn; those that fail come back to you to fix and deliver again.
- On a task of a started plan you work through the phase with nothing run:
  - Inside a phase `journal worker next` commits your task and gives you the next one at once. A proof may have no test.
  - A test run is refused. If you really need one, run it again with `--ask-main "<why>"`: the run does not happen, the
    request goes to your main agent, and you go on working. When it is allowed you are told, and that exact command
    runs once, without the flag.
  - At the end of the phase, `journal worker next` when your next task is in another phase, or `journal worker deliver`
    after your last, runs the tests of all your tasks of the phase and the phase's own test. Stop then.
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
