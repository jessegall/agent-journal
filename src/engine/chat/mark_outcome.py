from enum import StrEnum


class MarkOutcome(StrEnum):
    """How the thing a mark stands for ended or stands: running, passed, failed, warned, or none for a
    plain event."""

    NONE = "none"
    RUNNING = "running"
    PASSED = "passed"
    FAILED = "failed"
    WARNED = "warned"
