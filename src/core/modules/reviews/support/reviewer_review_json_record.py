from typing import TypedDict

from core.modules.reviews.support.reviewer_step_json_record import ReviewerStepJsonRecord


class ReviewerReviewJsonRecord(TypedDict):
    """The JSON form of a review in ReviewerBoard.json."""

    id: int
    title: str
    steps: list[ReviewerStepJsonRecord]
