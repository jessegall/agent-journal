from core.base.change.logged_event import LoggedEvent
from core.base.scope.actor_scope import ActorScope
from core.modules.chat.listeners.mark_listener import MarkListener
from core.modules.reviews.models.enums.review_mark_type import ReviewMarkType
from core.modules.reviews.models.enums.review_mark_variant import ReviewMarkVariant
from core.modules.reviews.models.review import Review
from core.base.change.moved import Moved
from core.modules.reviews.models.lifecycles.review_lifecycle import ReviewLifecycle


class ReviewStartedMarkListener(MarkListener[Moved[Review]]):
    """When a reviewer starts a review, the chat of the agent that asked shows a mark naming the reviewer and
    the subject."""

    name = "reviews.review-started-mark"
    moves = tuple([ReviewLifecycle.assign])
    disabled_scopes = [ActorScope]
    module_name = "journal.core.reviews"

    def handle(self, event: Moved[Review], logged: LoggedEvent) -> None:
        review = event.row
        self.show(logged, ReviewMarkType.REVIEW, ReviewMarkVariant.STARTED, f"Reviewer {review.reviewer_id} is reviewing {review.subject_model} {review.subject_id}",
                  review.requester_id, "review", review.id)
