from enum import StrEnum


class TaskState(StrEnum):
    OPEN = "open"
    STARTED = "started"
    PARKED = "parked"
    DONE = "done"
