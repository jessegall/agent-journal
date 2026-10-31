from enum import StrEnum


class TaskMarkVariant(StrEnum):
    """The move of a task a mark tells of."""

    STARTED = "started"
    CLOSED = "closed"
    BLOCKED = "blocked"
