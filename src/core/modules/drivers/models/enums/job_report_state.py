from enum import StrEnum


class JobReportState(StrEnum):
    """Where a helper job's handover stands."""

    PENDING = "pending"
    COMPLETED = "completed"
    REPORT_MISSING = "no-report"
    CAPTURE_FAILED = "capture-failed"
