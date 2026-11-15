from enum import StrEnum


class HoldEnd(StrEnum):
    """The declared ends of a hold row; a hold ends by one of these and by nothing else."""

    SATISFIED = "satisfied"
    WAIVED = "waived"
    EXPIRED = "expired"
    CANCELLED = "cancelled"
    TARGET_MISSING = "target-missing"
