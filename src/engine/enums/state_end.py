from enum import StrEnum


class StateEnd(StrEnum):
    """Why a frame left an agent's stack."""

    CLOSED = "closed"
    HANDED_IN = "handed-in"
    DELIVERED = "delivered"
    ANSWERED = "answered"
    CANCELLED = "cancelled"
    SATISFIED = "satisfied"
    WAIVED = "waived"
    EXPIRED = "expired"
    TARGET_MISSING = "target-missing"
