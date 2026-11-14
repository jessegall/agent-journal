from enum import StrEnum


class ReviewState(StrEnum):
    """Where a review stands."""

    QUEUED = "queued"
    REVIEWING = "reviewing"
    APPROVED = "approved"
    REJECTED = "rejected"
    UNDECIDED = "undecided"
    ABANDONED = "abandoned"
