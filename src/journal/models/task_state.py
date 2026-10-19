from enum import StrEnum


class TaskState(StrEnum):
    OPEN = "open"
    STARTED = "started"
    PARKED = "parked"
    BLOCKED = "blocked"
    DONE = "done"
    CANCELLED = "cancelled"

    def is_closed(self) -> bool:
        """Done or given up: nothing counts it as open any more."""
        return self in (TaskState.DONE, TaskState.CANCELLED)
