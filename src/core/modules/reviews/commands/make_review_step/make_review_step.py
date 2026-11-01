from dataclasses import dataclass

from core.base.command.make_command import MakeCommand
from core.modules.reviews.models.enums.step_outcome import StepOutcome
from core.modules.reviews.models.review_step import ReviewStep


@dataclass(frozen=True)
class MakeReviewStep(MakeCommand[ReviewStep]):
    review_id: int
    text: str
    outcome: StepOutcome = StepOutcome.NONE
