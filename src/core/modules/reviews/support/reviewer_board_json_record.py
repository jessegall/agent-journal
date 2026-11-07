from typing import TypedDict


class ReviewerBoardJsonRecord(TypedDict):
    """The JSON form of ReviewerBoard.json."""

    queued: object
    reviews: object
