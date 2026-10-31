from core.base.change.change import Change
from core.base.command.bus import Bus
from core.base.listener.save_listener import SaveListener
from core.base.model.model import Model
from core.modules.reviews.commands.add_reviewer import AddReviewer
from core.modules.reviews.commands.assign_next_review import AssignNextReview
from core.modules.reviews.models.review import Review
from core.modules.reviews.queries.reviewer_query import ReviewerQuery
from core.modules.reviews.support.review_settings import ReviewSettings


class ReviewQueuedListener(SaveListener):
    """A queued review goes to an idle reviewer at once; with none idle and room under the limit, a reviewer is
    added for it."""

    name = "reviews.review-queued"
    event = "review.create"

    def __init__(self, bus: Bus, reviewers: ReviewerQuery, settings: ReviewSettings) -> None:
        self.bus, self.reviewers, self.settings = bus, reviewers, settings

    def handle(self, change: Change[Model]) -> None:
        review = change.row
        if not isinstance(review, Review):
            return
        reviewers = self.reviewers.environment(review.environment_id)
        slots_available = reviewers.active().count() < self.settings.limit(review.environment_id)
        needs_reviewer = self.settings.enabled(review.environment_id) and not reviewers.idle().exists()
        if needs_reviewer and slots_available:
            self.bus.dispatch(AddReviewer(), change.context)
        self.bus.dispatch(AssignNextReview(review.environment_id), change.context)
