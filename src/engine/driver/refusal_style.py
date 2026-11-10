from enum import StrEnum


class RefusalStyle(StrEnum):
    """How a program represents a refusal for a hook event."""

    DENY = "deny"
    BLOCK = "block"
