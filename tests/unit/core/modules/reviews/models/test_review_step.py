from core.modules.reviews.commands.make_review_step import MakeReviewStep
from core.modules.reviews.models.enums.step_outcome import StepOutcome
from core.modules.reviews.models.review_step import ReviewStep


def test_a_step_has_no_outcome_until_it_is_given_one():
    assert ReviewStep(review_id=1, creator_id=1, text="Started reviewing task 1").outcome == StepOutcome.NONE
    assert MakeReviewStep(1, "1 passed", StepOutcome.PASSED).model() is ReviewStep
