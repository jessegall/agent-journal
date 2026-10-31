from enum import StrEnum


class ReviewMarkVariant(StrEnum):
    """What a review mark tells of."""

    TAKEN = "taken"
    APPROVED = "approved"
    SENT_BACK = "sent_back"
    UNDECIDED = "undecided"
