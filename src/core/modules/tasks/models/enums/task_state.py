from enum import StrEnum


class TaskState(StrEnum):
    """Where a task stands."""

    OPEN = "open"
    STARTED = "started"
    BLOCKED = "blocked"
    TESTING = "testing"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


UNFINISHED_STATES = (TaskState.OPEN, TaskState.STARTED, TaskState.BLOCKED, TaskState.TESTING)
UNSTARTED_STATES = (TaskState.OPEN, TaskState.BLOCKED)
WORKING_STATES = (TaskState.STARTED, TaskState.TESTING)
