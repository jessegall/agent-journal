from enum import StrEnum


class TaskPriority(StrEnum):
    """How soon a task should be taken up."""

    LOW = "low"
    NORMAL = "normal"
    HIGH = "high"
