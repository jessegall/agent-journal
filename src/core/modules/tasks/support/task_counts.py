from dataclasses import dataclass

TASK_COUNT_PERIODS = [("1", "Last hour"), ("6", "Last 6 hours"), ("24", "Last 24 hours"), ("today", "Today"), ("168", "Last 7 days"), ("now", "From now")]


@dataclass(frozen=True)
class TaskCounts:
    """How many tasks are started, blocked and open now, delegated ones among the open, and how many were completed after `since`."""

    started: int
    blocked: int
    open: int
    completed: int
    since: str
