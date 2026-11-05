from enum import StrEnum


class ReviewerState(StrEnum):
    """What a reviewer is doing."""

    IDLE = "idle"
    REVIEWING = "reviewing"
    ENDED = "ended"
    RETIRED = "retired"
