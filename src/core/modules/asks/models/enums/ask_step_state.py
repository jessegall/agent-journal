from enum import StrEnum


class AskStepState(StrEnum):
    """Where one level of a question's stack stands: waiting to reach its helper, with the helper, or ended."""

    WAITING = "waiting"
    DELIVERED = "delivered"
    ANSWERED = "answered"
    FIXED = "fixed"
    PASSED = "passed"
    MOOT = "moot"
