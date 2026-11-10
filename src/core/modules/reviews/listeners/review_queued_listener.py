from engine.command.bus import Bus
from core.base.listener.save_listener import SaveListener
from core.modules.reviews.commands.add_reviewer.add_reviewer import AddReviewer
from core.modules.reviews.commands.assign_next_review.assign_next_review import AssignNextReview
from core.modules.reviews.models.review import Review
from core.modules.reviews.queries.reviewer_query import ReviewerQuery
from core.modules.reviews.support.review_settings import ReviewSettings
from core.base.change.created import Created
from engine.command.context import Context


class ReviewQueuedListener(SaveListener[Created[Review]]):
    """A queued review goes to an idle reviewer at once; with none idle and room under the limit, a reviewer
    is added for it."""

    name = "reviews.review-queued"

    def __init__(self, bus: Bus, reviewers: ReviewerQuery, settings: ReviewSettings) -> None:
        self.bus, self.reviewers, self.settings = bus, reviewers, settings

    def handle(self, event: Created[Review], context: Context) -> None:
        reviewers = self.reviewers
        slots_available = reviewers.active().count() < self.settings.limit()
        needs_reviewer = self.settings.enabled() and not reviewers.idle().exists()
        if needs_reviewer and slots_available:
            self.bus.dispatch(AddReviewer(), context)
        self.bus.dispatch(AssignNextReview(), context)
