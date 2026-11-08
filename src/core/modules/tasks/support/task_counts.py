from dataclasses import dataclass

TASK_COUNT_PERIODS = [("1", "Last hour"), ("6", "Last 6 hours"), ("24", "Last 24 hours"), ("168", "Last 7 days"), ("now", "From now")]


@dataclass(frozen=True)
class TaskCounts:
    """How many tasks are started, blocked and delegated now, and how many were completed after `since`."""

    started: int
    blocked: int
    delegated: int
    completed: int
    since: str
