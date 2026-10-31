from core.base.change.change import Change
from core.base.guard.guard import Guard
from core.base.model.model import Model
from core.base.refusal import Refusal
from core.modules.reviews.models.lifecycles.review_lifecycle import ReviewLifecycle
from core.modules.reviews.models.review import Review

REPORTING_MOVES = (ReviewLifecycle.approve, ReviewLifecycle.send_back, ReviewLifecycle.leave_undecided)


class RecordedByItsReviewerGuard(Guard):
    """Refuses a report on a review from any agent but the review's reviewer."""

    name = "reviews.recorded-by-its-reviewer"
    event = "review.*"

    def check(self, change: Change[Model]) -> None:
        review = change.row
        if isinstance(review, Review) and change.move in REPORTING_MOVES and review.reviewer_id != change.actor.id:
            raise Refusal(f"agent {change.actor.id} is not the reviewer of review {review.id}", "only the reviewer the review was given to reports on it")
