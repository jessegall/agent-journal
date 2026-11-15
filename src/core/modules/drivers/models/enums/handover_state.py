from enum import StrEnum


class HandoverState(StrEnum):
    """Where a helper job's handover stands."""

    PENDING = "pending"
    COMPLETED = "completed"
    NO_REPORT = "no-report"
    CAPTURE_FAILED = "capture-failed"
