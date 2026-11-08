from dataclasses import dataclass


@dataclass(frozen=True)
class TaskCounts:
    """How many tasks are started, blocked and delegated now, and how many were completed after `since`."""

    started: int
    blocked: int
    delegated: int
    completed: int
    since: str
