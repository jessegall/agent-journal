from enum import StrEnum


class SequenceMarkVariant(StrEnum):
    """The move of a sequence run a mark tells of."""

    STARTED = "started"
    FINISHED = "finished"
    ABANDONED = "abandoned"
