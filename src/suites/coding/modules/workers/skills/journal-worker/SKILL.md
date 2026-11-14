---
name: journal-worker
description: Work your assigned tasks in your worktree, prove them, commit and ask for the merge; read it at the start of every worker session
---

# Being a worker

A worker is a helper that writes: it works in a worktree on its assigned tasks, each with its own brief. A stopped worker
stays kept on the same agent number and session until retired.

## Your work

- A full context is no reason to hurry or stop: it is compacted, and you get your task's overview, your memories and
  the memory marks back, so nothing you keep is lost. Keep working as before.
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

- `journal worker status` shows your started tasks and these lists: Tasks held (started, with the points that have no
  proof yet), Tasks staged (every point proved: the next commit takes them), Tasks waiting for tests (committed), Tasks
  you may start, Tasks blocked with the reason, and Tasks someone else holds (in your unit, but started by another
  agent or a user: ask about them). The main agent can name a worker with
  `journal worker status <number>`. Use `--page` and `--limit` for longer lists, or `--json` for structured output.
- `journal proof points --agent <number>` lists the points of your task's brief.
- Prove each one with `journal proof make <point> --task <task> "<file:line, and the test>" --test "<command>"`: the journal runs that
  test command in your worktree. Before making a proof, read the test suite and decide which existing tests and test
  files cover the code you changed. Include those and your new tests in the proof's `--test` command; it covers both.
  You may prove any task you have started, at any time: nothing is judged then. A proof with no test waits for the main agent's check.
- Correct your own unchecked proof with `journal proof edit <proof> --task <task> "<text>" --test "<command>"`, or with `journal proof make` again for the same point. The main agent can return a checked proof with `journal proof short <proof> "<reason>"`.
- Never run a plugin's check of the code on your own work. The journal judges your work when
  you commit it and when it is merged, and what it finds comes back to you to fix at its source.
- Start another of your tasks with `journal task start <task>`, or let `journal worker next` start the next one in the
  plan's order: it commits and tests nothing. You may have as many tasks started at once as the setting
  `most-open-tasks` allows (5 by default). A task another worker has started, a blocked task and a task after a
  checkpoint that has not passed are refused, and the refusal says which it is.
- `journal worker commit --differences "<what>"` judges and commits, in one commit, every started task whose points
  are all proved. Say in `--differences` only what you did other than the task's brief asked or left out of it, never
  what you did. When you followed the brief, `--differences none`.
- `journal worker update` brings your worktree up to the base branch it was cut from and keeps your uncommitted
  changes. Run it when you are told your base branch moved, or at a stopping point, never in the middle of an edit, and
  edit no file until it ends. When it clashes, read the clashing files and settle their markers before your next commit.
- A task already built needs no change: prove each point with where it is, and commit with `--differences "<why no change was needed>"`.
  With `--differences none`, a commit that changed nothing is refused. The main agent reads your line.
- A commit is never a merge, and nothing limits commits. It takes every started task whose points are all proved and
  leaves the others started; commit after each task, before a risky change and before you stop. A task sent to you alone
  asks for its merge by its last commit: then stop and wait. A unit of several tasks (a plan, a phase, tasks sent
  together) is merged when you ask: `journal worker ask-merge "<what the merge holds>"`, by default once, when all of it
  is committed and its tests passed. Ask earlier with `--up-to <task>` only when a finished, tested part is needed by
  someone now or your work has run so long that a late clash would be large; it carries every earlier commit. The ask is refused while a task is started, while tests of that work run or
  failed, or while a clash waits. The note is your report. Once it is merged the journal starts you on your next
  unit, in a new worktree.
- The tests of a commit: outside a plan the journal queues the tests of your proofs on that commit and returns any
  failure. In a plan the tests of each checkpoint run in the background on your commit, by the journal itself,
  and a failure comes back to you first: fix it before you go on. You may go on working meanwhile: your later edits do not change the result.
- When a test fails, its task is yours again and its proof is short: fix it, show the proof again with
  `journal proof make` and commit again. Only what failed runs again.
- Your test commands are those the journal found in the project's manifests and the ones your dispatch named;
  `journal worker presets` lists the found ones. For a command you lack, ask with `journal worker ask --about tests`.
- Run a test yourself only if you really need it. Each worker has three test commands between two commits by default,
  set by `worker-phase-test-runs`. Each counted command says how many remain. A fourth is refused; only then ask with
  `journal worker ask --about tests`. A granted line runs with `journal helper run` and does not use the allowance. The
  count starts anew at your next commit. After failed tests come back, runs are free until you commit again.
- A test or build, also `journal worker test`, holds your call for the setting `worker-run-wait-seconds` (60 by default), queued or
  running. If it ends in time you get its output at once; if not you get its output number and may go on or stop.
- A run that moves to the background is watched for you, so you need no Monitor: go on working and hear of its end on your
  next tool call, or stop and be started again when it ends.
- Git is not yours to run: the journal commits your work.
- `journal skill write` publishes the declared skill files into the project's .claude/skills and .agents/skills;
  it does not load a skill for you. Use the Skill tool on Claude Code or read the SKILL.md path on Codex.
- `journal module sync` updates the module registry and applies pending schema migrations. These are maintenance
  commands: use them when the journal asks for a repair, rather than as a way to load a skill. Workers may run them.

## When this happens

Read `journal worker status` first: it says the point you are at (build, commit, wait, fix, conflict, blocked, merge due or
question) and the one thing to do there. It names your unit and what is left of it. You do not stop to report until the unit is merged. Every refusal at a commit says what is wrong and what fixes it.
When you cannot go on, ask the merger; it hears your point, your last refusal, your last outputs, your task and your files.

| You saw | Ask | Meanwhile |
|---|---|---|
| A judge refusal you cannot place | `journal worker ask "<what>" --about judge` | fix the findings in your own files, leave the rest, and go on |
| No test runs left, or a test you cannot run | `journal worker ask "<what>" --about tests` | work on another task or prove what you have while the answer comes |
| The task is already built, or changed nothing | `journal worker ask "<what>" --about built` | prove each point with where it is and commit with --differences already built: <where>, then go on with your other tasks |
| A clash you cannot settle | `journal worker ask "<what>" --about conflict` | settle what you can in the named files |
| A tool or folder you do not have | `journal worker ask "<what>" --about tool` | do the part that needs no such tool |
| Anything else | `journal worker ask "<what>" --about general` | go on with anything the task still holds, or stop |

After you ask, the merger or the journal settles it and you are woken: you are told by when an answer is due, you may
stop meanwhile, and a question nobody answers in time goes to the main agent by itself. `journal worker status` shows
your open question. An open question lets you stop; the answer wakes you. Going on with other work ends the wait, and the answer still comes.

## Process rules

A worker needs no Monitor for a background run. It can continue independent work or stop and receive the
result when the run ends. A worker drafts and saves a reader for its own open request with
`journal reader draft <request> --save`, or edits the suggested `reader add` command. Every save uses the normal
checks and output proof. After the configured failed-save limit (default 3), it stops and the main agent is
asked to help. Drafts without `--save` use no try. A worker cannot remove readers, choose defaults or skip requests.

A reader's `--count-command` lists tests before a run waiting in its lane starts when `worker-run-most-tests` is
positive. Counts of test parts are added. A count above the limit stops the run. A listing that fails, is cut off
after 120 seconds or gives no number stops it too, and the line says why: a tool the worktree lacks, such as
`node_modules`, is linked with `--library-link` at dispatch. A test tool with no reader runs once, so a reader can
be drawn from its output.
