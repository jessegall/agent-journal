from core.modules.reviews.support.reviewer_board_json_record import ReviewerBoardJsonRecord
from collections.abc import Sequence
from dataclasses import dataclass

from core.modules.reviews.models.reviewer_row import ReviewerRow


@dataclass(frozen=True)
class ReviewerBoard:
    """What the reviewer window draws: the reviews being done with the steps of each, and how many reviews
    wait."""

    rows: Sequence[ReviewerRow]

    def json(self) -> ReviewerBoardJsonRecord:
        reviews = [row for row in self.rows if row.row_type == "review" and row.state == "reviewing"]
        return {"queued": sum(1 for row in self.rows if row.row_type == "review" and row.state == "queued"),
                "reviews": [{"id": review.review_id, "title": f"{review.subject_model} {review.subject_id}" if review.subject_model else f"Review {review.review_id}",
                             "steps": [{"id": step.step_id, "text": step.text, "outcome": step.outcome, "created_at": step.created_at.text}
                                       for step in self.rows if step.row_type == "step" and step.review_id == review.review_id]} for review in reviews]}
