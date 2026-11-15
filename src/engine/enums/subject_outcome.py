from enum import StrEnum


class SubjectOutcome(StrEnum):
    """How one subject of a wait ended; a lost run or a deleted row is missing, never succeeded."""

    SUCCEEDED = "succeeded"
    FAILED = "failed"
    CANCELLED = "cancelled"
    MISSING = "missing"
