from core.base.chat.mark_outcome import MarkOutcome
from core.base.change.logged_event import LoggedEvent
from core.modules.chat.commands.show_mark import ShowMark
from core.modules.chat.listeners.mark_listener import MarkListener
from core.modules.reviews.models.enums.review_mark_type import ReviewMarkType
from core.modules.reviews.models.enums.review_mark_variant import ReviewMarkVariant
from core.modules.reviews.models.review import Review

REPORTED = {"review.approve": (ReviewMarkVariant.APPROVED, MarkOutcome.PASSED), "review.send_back": (ReviewMarkVariant.SENT_BACK, MarkOutcome.FAILED),
            "review.leave_undecided": (ReviewMarkVariant.UNDECIDED, MarkOutcome.NONE)}


class ReviewReportedMarkListener(MarkListener):
    """When a reviewer reports, the chat of the agent that asked shows the report in one mark, passed when the review is approved, failed when it is sent back."""

    name = "reviews.review-reported-mark"
    event = "review.*"
    module_name = "journal.core.reviews"

    def handle(self, event: LoggedEvent) -> None:
        if event.event not in REPORTED:
            return
        variant, outcome = REPORTED[event.event]
        review = self.queries.query(Review).find(event.row_id)
        self.bus.run(ShowMark(review.environment_id, ReviewMarkType.REVIEW, variant, f"{variant.value}:{review.id}:{event.id}",
                              f"Reviewer {review.reviewer_id} reports on {review.subject_model} {review.subject_id}: {review.report}", agent_id=review.requester_id,
                              row_model="review", row_id=review.id, outcome=outcome, ended=True),
                     self.actors.actor(self.module_name), cause_id=event.id, environment_id=review.environment_id)
