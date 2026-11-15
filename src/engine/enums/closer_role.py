from enum import StrEnum


class CloserRole(StrEnum):
    """Who besides a person may waive a hold."""

    AGENT = "agent"
    PARENT = "parent"
