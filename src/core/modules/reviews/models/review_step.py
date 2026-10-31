from dataclasses import dataclass

from core.base.model.model import Model
from core.modules.reviews.models.enums.step_outcome import StepOutcome


@dataclass(frozen=True, kw_only=True)
class ReviewStep(Model):
    """One line of a review's progress: that it started, a point of its report, or that the report was handed over."""

    model_name = "review_step"
    cli_name = "review-step"

    review_id: int
    creator_id: int
    text: str
    outcome: StepOutcome = StepOutcome.NONE
