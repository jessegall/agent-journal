from dataclasses import dataclass

from core.base.model.model import Model
from core.base.refusal import Refusal
from core.modules.reviews.models.enums.point_finding import PointFinding


@dataclass(frozen=True, kw_only=True)
class ReviewPoint(Model):
    """One point of a review's report: its number, whether it passed, fell short or could not be decided, and why."""

    model_name = "review_point"
    cli_name = "review-point"

    review_id: int
    creator_id: int
    number: int
    finding: PointFinding
    reason: str = ""

    def __post_init__(self) -> None:
        if self.number < 1:
            raise Refusal(f"a point is numbered from 1, not {self.number}", "name the point by its number in the brief")
