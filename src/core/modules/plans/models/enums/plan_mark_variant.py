from enum import StrEnum


class PlanMarkVariant(StrEnum):
    """The move of a plan a mark tells of."""

    STARTED = "started"
    CLOSED = "closed"
    BLOCKED = "blocked"
    CANCELLED = "cancelled"
