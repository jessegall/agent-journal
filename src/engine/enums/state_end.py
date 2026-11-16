from enum import StrEnum


class StateEnd(StrEnum):
    """Why a stacked state left an agent's stack."""

    CLOSED = "closed"
    SUBMITTED = "handed-in"
    DELIVERED = "delivered"
    ANSWERED = "answered"
    CANCELLED = "cancelled"
    SATISFIED = "satisfied"
    WAIVED = "waived"
    EXPIRED = "expired"
    TARGET_MISSING = "target-missing"
