from enum import StrEnum


class QueueSection(StrEnum):
    """The three lists in the process queue inspector."""

    RUNNING = "running"
    WAITING = "waiting"
    RECENT = "recent"
