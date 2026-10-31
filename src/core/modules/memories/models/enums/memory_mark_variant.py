from enum import StrEnum


class MemoryMarkVariant(StrEnum):
    """What happened to a memory, as its mark says it."""

    MADE = "made"
    WEIGHED = "weighed"
    REMOVED = "removed"
    FADED = "faded"
    GIVEN = "given"
    COMPACTED = "compacted"
