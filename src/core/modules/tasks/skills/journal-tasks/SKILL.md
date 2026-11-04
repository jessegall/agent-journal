---
name: journal-tasks
description: Declare, log and finish the current work; read it before the first task command of a session
---

# Tasks

A task is one unit of work: open, started, then completed or cancelled. Declare a task before you write.

- `journal task make "<title>" --brief "<what and done when>"` files one; `--priority low|high|critical` when it is not
  normal. Do not start what you file: leave it open, and the suite of the environment hands it out, if it has a way to.
- Add `--phase <phase>` to `journal task make` to put the new task at the end of that phase in the same command.
  A missing phase or an ended plan refuses the command and leaves no new task.
- `journal task start <n>` takes a task in hand; `journal task list` shows the tasks here, `--state open` narrows it.
- `journal task brief <n>` prints a task's title, brief and comments. A task handed to you blocks your writes until you
  have run it, and again after each compaction.
- `journal task show <n>` reads one row; `journal task inspect <n>` adds what it waits on and its latest log lines.
- `journal task edit <n> --title "<title>" --brief "<what and done when>"` writes either anew. `--brief` replaces the
  whole brief, so read it first.
- Log with `journal task log <n> "<where it stands>"` after each step that matters. Writes wait once too many have gone
  by with nothing logged.
- Work that is written but not yet tested moves to testing with `journal task test <n>` before you start the next task;
  that is where the user sees it, and a batch of them is tested together.
- Finish with `journal task close <n> --outcome "<what was done, what was not>"`, or
  `journal task cancel <n> --reason "<why>"`.

## What comes next

When your task closes, the journal starts the next one: a critical task first, then the tasks of a started plan, then
the most urgent open task. With other tasks still in hand it starts a critical task if one is open, and otherwise takes you back to one of them.

## Waiting

A wait is a block the journal can see, never words in a log line. A blocked task is not handed out.

- `journal task block <n> --on task:<m>`, or `--on question:<m>` or `--on plan:<m>`: it opens once that row ends.
- `journal task block <n> --until '<command>' --every <minutes>`: it opens once the command passes.
- `journal task block <n> --reason "<what it waits on>"`, and `journal task unblock <n>` when that has arrived.
- `journal task depend <n> --on <m>` makes a task wait on another without blocking it now;
  `journal task graph` shows what waits on what.
- When you are stuck, say so with `journal wait stuck "<why>"`.

File work you put off in words as a task: work put off in words is lost.
