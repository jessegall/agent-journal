from engine.guard.guard import Guard
from engine.errors.refusal import Refusal
from core.modules.reviews.models.lifecycles.review_lifecycle import ReviewLifecycle
from core.modules.reviews.models.review import Review
from engine.change.changed import Changed
from engine.command.context import Context

REPORTING_MOVES = (ReviewLifecycle.approve, ReviewLifecycle.reject, ReviewLifecycle.leave_undecided)


class ReporterIsReviewerGuard(Guard[Changed[Review]]):
    """Refuses a report on a review from any agent but the review's reviewer."""

    name = "reviews.reporter-is-reviewer"

    def check(self, event: Changed[Review], context: Context) -> None:
        review = event.row
        if event.move in REPORTING_MOVES and review.reviewer_id != context.actor.id:
            raise Refusal(f"agent {context.actor.id} is not the reviewer of review {review.id}", "only the reviewer assigned to a review reports on it")
