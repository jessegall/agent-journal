from enum import StrEnum


class MemoryOrder(StrEnum):
    """The orders a memory list can be read in."""

    NEWEST = "newest"
    WEIGHT = "weight"
