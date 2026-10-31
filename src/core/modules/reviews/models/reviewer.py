from dataclasses import dataclass

from core.base.actor import Actor
from core.base.model.model import Model
from core.base.timestamp import Timestamp
from core.modules.reviews.models.enums.reviewer_state import ReviewerState
from core.modules.reviews.models.lifecycles.reviewer_lifecycle import ReviewerLifecycle


@dataclass(frozen=True, kw_only=True)
class Reviewer(Model):
    """An agent of role reviewer that takes the queued reviews one after another; its id is its agent's id, and its state moves only as ReviewerLifecycle allows."""

    model_name = "reviewer"
    cli_name = "reviewer"
    lifecycle = ReviewerLifecycle

    environment_id: int
    creator_id: int
    program: str
    model: str = ""
    state: ReviewerState = ReviewerState.IDLE

    def take(self, timestamp: Timestamp, actor: Actor) -> "Reviewer":
        return self.moved(ReviewerLifecycle.take)

    def finish(self, timestamp: Timestamp, actor: Actor) -> "Reviewer":
        return self.moved(ReviewerLifecycle.finish)

    def end(self, timestamp: Timestamp, actor: Actor) -> "Reviewer":
        return self.moved(ReviewerLifecycle.end)

    def retire(self, timestamp: Timestamp, actor: Actor) -> "Reviewer":
        return self.moved(ReviewerLifecycle.retire)
