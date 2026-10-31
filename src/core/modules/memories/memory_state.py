from enum import StrEnum


class MemoryState(StrEnum):
    """Whether a memory is still kept."""

    ACTIVE = "active"
    REMOVED = "removed"
