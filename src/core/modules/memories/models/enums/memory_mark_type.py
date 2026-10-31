from enum import StrEnum


class MemoryMarkType(StrEnum):
    """The chat mark types the memories module adds."""

    MEMORY = "memories.memory"
    REMINDER = "memories.reminder"
    COMPACTION = "memories.compaction"
