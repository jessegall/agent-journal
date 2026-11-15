from enum import StrEnum


class ConditionOutcome(StrEnum):
    """What a hold's condition class answers when it is judged; a missing row is never satisfied."""

    PENDING = "pending"
    SATISFIED = "satisfied"
    CANCELLED = "cancelled"
    TARGET_MISSING = "target-missing"
    UNAVAILABLE = "unavailable"
