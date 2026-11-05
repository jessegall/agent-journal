from core.base.change.logged_event import LoggedEvent
from core.base.chat.mark_outcome import MarkOutcome
from core.base.command.bus import Bus
from core.base.listener.commit_listener import CommitListener
from core.base.module.module_actors import ModuleActors
from core.base.query.queries import Queries
from core.base.scope.actor_scope import ActorScope
from core.modules.chat.commands.show_mark.show_mark import ShowMark
from core.modules.reviews.listeners.reviewer_ended_listener import MODULE_NAME
from core.modules.reviews.models.enums.review_mark_type import ReviewMarkType
from core.modules.reviews.models.enums.review_mark_variant import ReviewMarkVariant
from core.modules.reviews.models.review import Review
from core.base.change.changed import Changed

REPORTED = {"review.approve": (ReviewMarkVariant.APPROVED, MarkOutcome.PASSED), "review.reject": (ReviewMarkVariant.REJECTED, MarkOutcome.FAILED),
            "review.leave_undecided": (ReviewMarkVariant.UNDECIDED, MarkOutcome.NONE)}


class ReviewReportedMarkListener(CommitListener[Changed[Review]]):
    """When a reviewer reports, the chat of the agent that asked shows the report in one mark: passed when the
    review is approved, failed when it is rejected."""

    name = "reviews.review-reported-mark"
    disabled_scopes = [ActorScope]

    def __init__(self, bus: Bus, actors: ModuleActors, queries: Queries) -> None:
        self.bus, self.actors, self.queries = bus, actors, queries

    def handle(self, event: Changed[Review], logged: LoggedEvent) -> None:
        if logged.event not in REPORTED:
            return
        variant, outcome = REPORTED[logged.event]
        review = event.row
        self.bus.run(ShowMark(review.environment_id, ReviewMarkType.REVIEW, variant, f"{variant.value}:{review.id}:{logged.id}",
                              f"Reviewer {review.reviewer_id} reports on {review.subject_model} {review.subject_id}: {review.report}", agent_id=review.requester_id,
                              row_model="review", row_id=review.id, outcome=outcome, ended=True),
                     self.actors.actor(MODULE_NAME), cause_id=logged.id, environment_id=review.environment_id)
