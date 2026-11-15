from enum import StrEnum


class MemoryMarkVariant(StrEnum):
    """What happened to a memory, as its mark says it."""

    MADE = "made"
    WEIGHED = "weighed"
    EDITED = "edited"
    REMOVED = "removed"
    FADED = "faded"
    GIVEN = "given"
    COMPACTED = "compacted"
    ACKNOWLEDGED = "acknowledged"
