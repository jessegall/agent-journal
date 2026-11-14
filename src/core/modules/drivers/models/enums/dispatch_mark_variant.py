from enum import StrEnum


class DispatchMarkVariant(StrEnum):
    """What a helper job's mark says: the helper was sent, or it finished."""

    DISPATCHED = "dispatched"
    FINISHED = "finished"
