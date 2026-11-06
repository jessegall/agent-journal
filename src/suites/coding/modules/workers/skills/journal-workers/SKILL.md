---
name: journal-workers
description: Send a worker to write a bounded job, check its proofs and merge its work; read it before dispatching one
---

# Workers

A helper only reads. A worker writes, in a worktree of its own, on one task whose brief is its whole prompt.

## As the one who sends

- `journal worker dispatch <task> [<task> ...] --model <model>` starts a worker on the tasks; `--profile` is a checked worker profile, journal-worker by default, whose text the worker starts from, and `--model` falls back to that profile's model (`--name` shows on its card), which it takes one by one with no report in
  between; the journal runs the tests of each before the next starts and tells you when the last passes. `--library-link <folder>` links a folder such as
  `.venv` into its worktree and `--library-copy <folder>` copies it. `--program <program>` names the agent program.
- `journal worker dispatch --plan <plan> [--phase <phase>] --model <model>` hands a worker the open tasks of an approved or
  started plan, or of one phase of it, in the plan's order. The plan then shows as delegated, with each task's agent named.
- Give a worker many tasks at once: a large batch runs long and bothers you less than many small dispatches.
- `journal worker models` lists each program's models from the cheapest to the strongest.
- A worker that reported takes its next job with `journal worker send <n> "<job>"`, with its memory of the last. Send
  related work to the worker that knows it; never start a new one on work another already knows.
- Read each proof with `journal proof list --task <n>`, check it with `journal proof check <n>` or send it back with
  `journal proof short <n> "<what is missing>"`.
- Take the work in with `journal worker merge <worker>` once every point is checked; nothing else adds a worker's work.
  It first merges the branch into the worktree. When only built files under `web/dist` clash it keeps the branch's:
  rebuild after it. A clash in source goes back to the worker with conflict markers to settle.
- `journal worker release <worker> "<why>"` puts its task back to open.

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

- `journal worker report "<what the task needs>"` sends your main agent a message number to read while you keep
  working. Use it for a report or a request that does not require stopping.

- `journal worker status` shows your current task, tests waiting and remaining assignments. The main agent can name
  a worker with `journal worker status <n>`. Use `--page` and `--limit` for longer lists, or `--json` for structured output.
- `journal proof points --agent <n>` lists the points of your task's brief.
- Prove each one with `journal proof make <point> "<file:line, and the test>" --test "<command>"`: the journal runs that
  test command in your worktree. A proof with no test waits for the main agent's check.
- Correct your own unchecked proof with `journal proof edit <proof> "<text>" --test "<command>"`, or with `journal proof make` again for the same point. A checked proof cannot be changed.
- `journal worker next` hands your task over for testing: the plugins judge your changes, a refusal says what to put
  right; the journal commits and runs its proofs' tests in turn. Stop then: a failure or your next task comes back to you.
- `journal worker deliver` hands in all your tasks together, refused while one is queued. The journal then runs your
  tests in turn; those that fail come back to you to fix and deliver again.
- A run that moves to the background is watched for you, so you need no Monitor: go on working and hear of its end on your
  next tool call, or stop and be started again when it ends.
- Git is not yours to run: the journal commits your work.
- Use python3 for Python commands.
- `journal skill write` publishes the declared skill files into the project's .claude/skills and .agents/skills;
  it does not load a skill for you. Use the Skill tool on Claude Code or read the SKILL.md path on Codex.
- `journal module sync` updates the module registry and applies pending schema migrations. These are maintenance
  commands: use them when the journal asks for a repair, rather than as a way to load a skill. Workers may run them.
