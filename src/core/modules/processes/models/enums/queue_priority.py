from enum import StrEnum


class QueuePriority(StrEnum):
    """Where a waiting run stands among the others: a high one is given a place before a normal one, a low one
    after."""

    HIGH = "high"
    NORMAL = "normal"
    LOW = "low"

    @property
    def rank(self) -> int:
        return list(QueuePriority).index(self)
