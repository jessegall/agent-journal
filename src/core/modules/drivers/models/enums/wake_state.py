from enum import StrEnum


class WakeState(StrEnum):
    """Where an agent's wake obligation stands, from written to acknowledged, cancelled or expired."""

    OPEN = "open"
    INHIBITED = "inhibited"
    CLAIMED = "claimed"
    DELIVERED = "delivered"
    ACKNOWLEDGED = "acknowledged"
    CANCELLED = "cancelled"
    EXPIRED = "expired"
