from enum import StrEnum


class AffectedTestState(StrEnum):
    """Where the picked test run of one worker hand-in stands."""

    QUEUED = "queued"
    PICKING = "picking"
    TESTING = "testing"
    PASSED = "passed"
    FAILED = "failed"
    CANCELLED = "cancelled"
