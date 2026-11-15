from enum import StrEnum


class EscalationState(StrEnum):
    """Where an agent's escalation stands."""

    OPEN = "open"
    RESOLVED = "resolved"
    CONTINUED = "continued"
    CANCELLED = "cancelled"
