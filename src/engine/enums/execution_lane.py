from enum import StrEnum


class ExecutionLane(StrEnum):
    """Which queue an execution waits in; each lane has its own capacity."""

    INSTANT = "instant"
    SHORT = "short"
    LONG = "long"
