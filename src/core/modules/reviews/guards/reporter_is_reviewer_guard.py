from engine.guard.guard import Guard
from engine.errors.refusal import Refusal
from core.modules.reviews.models.lifecycles.review_lifecycle import ReviewLifecycle
from core.modules.reviews.models.review import Review
from engine.event.changed import Changed
from engine.command.context import Context
from core.modules.assignments.support.assignments import Assignments

REPORTING_MOVES = (ReviewLifecycle.approve, ReviewLifecycle.reject, ReviewLifecycle.leave_undecided)


class ReporterIsReviewerGuard(Guard[Changed[Review]]):
    """Refuses a report on a review from any agent but the review's reviewer."""

    name = "reviews.reporter-is-reviewer"

    def __init__(self, assignments: Assignments) -> None:
        self.assignments = assignments

    def check(self, event: Changed[Review], context: Context) -> None:
        review = event.row
        if event.move in REPORTING_MOVES and self.assignments.actor(review) != context.actor.id:
            raise Refusal(f"review {review.id} has another reviewer", "only the reviewer assigned to a review reports on it")
