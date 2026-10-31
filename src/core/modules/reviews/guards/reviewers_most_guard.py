from core.base.change.change import Change
from core.base.guard.guard import Guard
from core.base.model.model import Model
from core.base.refusal import Refusal
from core.modules.reviews.models.reviewer import Reviewer
from core.modules.reviews.queries.reviewer_query import ReviewerQuery
from core.modules.reviews.support.review_settings import REVIEWERS_MOST_SETTING, ReviewSettings


class ReviewersMostGuard(Guard):
    """Refuses a new reviewer once as many reviewers are out as the limit allows."""

    name = "reviews.reviewers-most"
    event = "reviewer.create"

    def __init__(self, reviewers: ReviewerQuery, settings: ReviewSettings) -> None:
        self.reviewers, self.settings = reviewers, settings

    def check(self, change: Change[Model]) -> None:
        reviewer = change.row
        if not isinstance(reviewer, Reviewer):
            return
        out = self.reviewers.environment(reviewer.environment_id).out().count()
        if out >= self.settings.most(reviewer.environment_id):
            raise Refusal(f"{out} reviewers are out, the limit {REVIEWERS_MOST_SETTING} sets", f"retire one with journal reviewer retire, or raise the limit with journal setting make {REVIEWERS_MOST_SETTING} <count>")
