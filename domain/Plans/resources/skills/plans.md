# Plans

## States

A plan has a type (build, fix, research or cleanup) and moves through these states: planned, reviewing, started, paused, and finally done or cancelled. Its phases hold its tasks in order.

## Holding plan work

- `plan:assigned` lists the plans you hold. `--search` narrows by words in the title and `--state` by state; `--page` and `--per-page` page through them.
- `plan:assign-work plans.plan <id> --to <type:id>` gives a plan and all its unfinished work to one holder; use `plans.phase` for one phase.
- `plan:reassign-work` moves that work to another holder and `plan:unassign-work` releases it. Both name the assignment or holder it has now, so a change made meanwhile by someone else is refused rather than overwritten.

A holder is written as type:id, such as agent:01jd8x0g9m3qz6v4k2t7r5w1ce.
