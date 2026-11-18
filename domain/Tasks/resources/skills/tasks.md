# Tasks

## States

A task is open until someone starts it, then started; it may be blocked while it waits on something, and it ends finished or cancelled. A task keeps a log of what happened to it.

## The tasks you hold

- `task:assigned` lists the tasks you hold, each with the assignment reference it holds. `--search` narrows by words in the title, `--state` by state, and `--page` and `--per-page` page through them.
- The MCP tool `tasks_assigned` answers the same list; send only the continuation a result gave to read the next page.
- Your overview names how many unfinished tasks you hold.

You see only tasks you may read; a task outside your reach answers as not found.

## Starting, blocking and finishing

Starting a task makes it the work in hand. Blocking it records the reason it waits and ends its work on every stack until it is unblocked. A wait is a block the journal can see, never only words in a log line. Finishing or cancelling it ends it for good; a finished task is not started again.
