# Plans

A plan orders the work: phases of tasks, worked one phase after another.

## States

A plan has a type (build, fix, research or cleanup) and moves through these states: planned, reviewing, started, paused, and finally done or cancelled. Its phases hold its tasks in order.

Work a started plan phase by phase, in one go: write every task of a phase before running its tests, run the tests written or touched for the phase together once at its end, fix what they find and rerun only what failed. Run the whole suite only where a checkpoint asks for it, and go straight on to the next phase without stopping to report.

## Holding plan work

- `plan:assigned` lists the plans you hold. `--search` narrows by words in the title and `--state` by state; `--page` and `--per-page` page through them.
- `plan:assign-work plans.plan <id> --to <type:id>` gives a plan and all its unfinished work to one holder; use `plans.phase` for one phase.
- `plan:reassign-work` moves that work to another holder and `plan:unassign-work` releases it. Both name the assignment or holder it has now, so a change made meanwhile by someone else is refused rather than overwritten.

A holder is written as type:id, such as agent:01jd8x0g9m3qz6v4k2t7r5w1ce.
