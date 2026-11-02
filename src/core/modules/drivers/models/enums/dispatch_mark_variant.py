from enum import StrEnum


class DispatchMarkVariant(StrEnum):
    """What a dispatch's mark says: the subagent was sent, or it finished."""

    DISPATCHED = "dispatched"
    FINISHED = "finished"
