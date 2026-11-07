from core.base.guard.guard import Guard
from core.base.model.model import Model
from core.base.refusal import Refusal
from core.modules.reviews.models.reviewer import Reviewer
from core.modules.reviews.queries.reviewer_query import ReviewerQuery
from core.modules.reviews.support.review_settings import REVIEWERS_MOST_SETTING, ReviewSettings
from core.base.change.created import Created
from core.base.command.context import Context


class ReviewersMostGuard(Guard[Created[Reviewer]]):
    """Refuses a new reviewer once as many reviewers are out as the limit allows."""

    name = "reviews.reviewers-most"

    def __init__(self, reviewers: ReviewerQuery, settings: ReviewSettings) -> None:
        self.reviewers, self.settings = reviewers, settings

    def check(self, event: Created[Reviewer], context: Context) -> None:
        reviewer = event.row
        active = self.reviewers.active().count()
        if active >= self.settings.limit():
            raise Refusal(f"{active} reviewers are out, the limit {REVIEWERS_MOST_SETTING} sets", f"retire one with journal reviewer retire, or raise the limit with journal setting set {REVIEWERS_MOST_SETTING} <count>")
