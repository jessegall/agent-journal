from core.base.change.change import Change
from core.base.guard.guard import Guard
from core.base.model.model import Model
from core.base.refusal import Refusal
from core.modules.reviews.models.reviewer import Reviewer
from core.modules.reviews.support.review_settings import REVIEWER_SETTING, ReviewSettings


class ReviewerIsOnGuard(Guard):
    """Refuses a new reviewer while reviewers are switched off."""

    name = "reviews.reviewer-is-on"
    event = "reviewer.create"

    def __init__(self, settings: ReviewSettings) -> None:
        self.settings = settings

    def check(self, change: Change[Model]) -> None:
        reviewer = change.row
        if isinstance(reviewer, Reviewer) and not self.settings.is_on(reviewer.environment_id):
            raise Refusal("reviewers are switched off", f"turn them on with journal setting make {REVIEWER_SETTING} true")
