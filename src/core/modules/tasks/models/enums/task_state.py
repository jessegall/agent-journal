from enum import StrEnum


class TaskState(StrEnum):
    """Where a task stands."""

    OPEN = "open"
    STARTED = "started"
    BLOCKED = "blocked"
    TESTING = "testing"
    COMPLETED = "completed"
    CANCELLED = "cancelled"
