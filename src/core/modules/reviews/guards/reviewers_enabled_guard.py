from core.base.guard.guard import Guard
from engine.errors.refusal import Refusal
from core.modules.reviews.models.reviewer import Reviewer
from core.modules.reviews.support.review_settings import REVIEWER_SETTING, ReviewSettings
from core.base.change.created import Created
from core.base.command.context import Context


class ReviewersEnabledGuard(Guard[Created[Reviewer]]):
    """Refuses a new reviewer while reviewers are switched off."""

    name = "reviews.reviewers-enabled"

    def __init__(self, settings: ReviewSettings) -> None:
        self.settings = settings

    def check(self, event: Created[Reviewer], context: Context) -> None:
        if not self.settings.enabled():
            raise Refusal("reviewers are switched off", f"turn them on with journal setting make {REVIEWER_SETTING} true")
