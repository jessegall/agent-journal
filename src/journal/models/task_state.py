from enum import StrEnum


class TaskState(StrEnum):
    OPEN = "open"
    STARTED = "started"
    DELEGATED = "delegated"
    SUSPENDED = "parked"
    BLOCKED = "blocked"
    FINISHED = "done"
    CANCELLED = "cancelled"

    def is_closed(self) -> bool:
        return self in (TaskState.FINISHED, TaskState.CANCELLED)
