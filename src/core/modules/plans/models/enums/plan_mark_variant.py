from enum import StrEnum


class PlanMarkVariant(StrEnum):
    """The move of a plan a mark tells of."""

    MADE = "made"
    STARTED = "started"
    CLOSED = "closed"
    BLOCKED = "blocked"
    CANCELLED = "cancelled"
