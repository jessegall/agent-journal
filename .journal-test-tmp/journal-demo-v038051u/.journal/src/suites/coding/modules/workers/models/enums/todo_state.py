from enum import StrEnum


class TodoState(StrEnum):
    """Where an item of an agent program's to-do list stands, as the program reports it."""

    PENDING = "pending"
    ACTIVE = "in_progress"
    COMPLETED = "completed"
