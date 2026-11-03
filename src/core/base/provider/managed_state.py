from enum import StrEnum


class ManagedState(StrEnum):
    """Whether the journal runs a managed hook."""

    ENABLED = "on"
    DISABLED = "off"
