from core.base.change.logged_event import LoggedEvent
from core.modules.chat.listeners.mark_listener import MarkListener
from core.modules.reviews.models.enums.review_mark_type import ReviewMarkType
from core.modules.reviews.models.enums.review_mark_variant import ReviewMarkVariant
from core.modules.reviews.models.review import Review


class ReviewTakenMarkListener(MarkListener):
    """When a reviewer takes a review, the chat of the agent that asked shows a mark naming the reviewer and the subject."""

    name = "reviews.review-taken-mark"
    event = "review.assign"
    module_name = "journal.core.reviews"

    def handle(self, event: LoggedEvent) -> None:
        review = self.queries.query(Review).find(event.row_id)
        self.show(event, ReviewMarkType.REVIEW, ReviewMarkVariant.TAKEN, f"Reviewer {review.reviewer_id} is reviewing {review.subject_model} {review.subject_id}",
                  review.environment_id, review.requester_id, "review", review.id)
