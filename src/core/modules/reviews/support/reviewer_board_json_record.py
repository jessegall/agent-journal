from typing import TypedDict

from core.modules.reviews.support.reviewer_review_json_record import ReviewerReviewJsonRecord


class ReviewerBoardJsonRecord(TypedDict):
    """The JSON form of ReviewerBoard.json."""

    queued: int
    reviews: list[ReviewerReviewJsonRecord]
