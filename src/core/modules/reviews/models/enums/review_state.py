from enum import StrEnum


class ReviewState(StrEnum):
    """Where a review stands."""

    QUEUED = "queued"
    REVIEWING = "reviewing"
    APPROVED = "approved"
    SENT_BACK = "sent_back"
    UNDECIDED = "undecided"
    ABANDONED = "abandoned"
