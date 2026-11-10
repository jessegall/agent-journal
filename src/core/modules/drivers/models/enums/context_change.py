from enum import StrEnum


class ContextChange(StrEnum):
    """What is done to an agent's context: it is compacted to a summary, or cleared."""

    COMPACT = "compact"
    CLEAR = "clear"
