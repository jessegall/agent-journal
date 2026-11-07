from enum import StrEnum


class ReviewMarkVariant(StrEnum):
    """What a review mark tells of."""

    STARTED = "started"
    APPROVED = "approved"
    REJECTED = "rejected"
    UNDECIDED = "undecided"
