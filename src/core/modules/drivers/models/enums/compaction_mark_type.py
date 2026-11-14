from enum import StrEnum


class CompactionMarkType(StrEnum):
    """The chat mark of a compaction that went wrong."""

    COMPACTION = "drivers.compaction"
