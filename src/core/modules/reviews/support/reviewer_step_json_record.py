from typing import TypedDict


class ReviewerStepJsonRecord(TypedDict):
    """The JSON form of a step in ReviewerBoard.json."""

    id: int
    text: str
    outcome: str
    created_at: str
