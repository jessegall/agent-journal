from core.base.command.bus import Bus
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.modules.reviews.commands.assign_next_review.assign_next_review import AssignNextReview
from core.modules.reviews.commands.assign_review.assign_review import AssignReview
from core.modules.reviews.commands.start_reviewer.start_reviewer import StartReviewer
from core.modules.reviews.queries.review_query import ReviewQuery
from core.modules.reviews.queries.reviewer_query import ReviewerQuery


class AssignNextReviewHandler(Handler[AssignNextReview, None]):
    """Moves the oldest queued review to the oldest idle reviewer, and the reviewer to reviewing."""

    command = AssignNextReview

    def __init__(self, reviews: ReviewQuery, reviewers: ReviewerQuery, bus: Bus) -> None:
        self.reviews, self.reviewers, self.bus = reviews, reviewers, bus

    def handle(self, command: AssignNextReview, context: Context) -> None:
        queued = self.reviews.queued().first()
        idle = self.reviewers.idle().oldest().first()
        if queued is not None and idle is not None:
            self.bus.dispatch(AssignReview(queued.id, idle.id), context)
            self.bus.dispatch(StartReviewer(idle.id), context)
