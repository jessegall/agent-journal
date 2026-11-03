from enum import StrEnum


class TriggerMarkVariant(StrEnum):
    """How a trigger's mark in the chat stands."""

    WAITING = "waiting"
    ENABLED = "enabled"
    REMOVED = "removed"
