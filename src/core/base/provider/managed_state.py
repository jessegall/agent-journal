from enum import StrEnum


class ManagedState(StrEnum):
    """Whether the journal runs a managed hook."""

    ON = "on"
    OFF = "off"
