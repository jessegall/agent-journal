from dataclasses import dataclass

TASK_COUNT_PERIODS = [("1", "Last hour"), ("6", "Last 6 hours"), ("24", "Today"), ("168", "This week"), ("now", "From now")]


@dataclass(frozen=True)
class TaskCounts:
    """How many tasks are started, blocked and delegated now, and how many were completed after `since`."""

    started: int
    blocked: int
    delegated: int
    completed: int
    since: str
