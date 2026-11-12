from dataclasses import dataclass

from engine.actor.actor import Actor
from engine.enums.actor_count import ActorCount
from engine.model.assignable import Assignable
from engine.model.environment_scoped import EnvironmentScoped
from engine.model.model import Model
from engine.model.state_holder import StateHolder
from engine.time.timestamp import Timestamp
from core.modules.reviews.models.enums.review_state import ReviewState
from core.modules.reviews.models.lifecycles.review_lifecycle import ReviewLifecycle


@dataclass(frozen=True, kw_only=True)
class Review(EnvironmentScoped, Model, StateHolder, Assignable):
    """One request to have a row's work checked, point by point; its state moves only as ReviewLifecycle
    allows. Its one reviewer is the agent it is assigned to."""

    model_name = "review"
    cli_name = "review"
    lifecycle = ReviewLifecycle
    added_state_moves = tuple([ReviewLifecycle.abandon])
    takes_actors = ActorCount.SINGLE

    environment_id: int = 0
    subject_model: str
    subject_id: int
    requester_id: int
    brief: str = ""
    point_count: int
    state: ReviewState = ReviewState.QUEUED
    report: str = ""
    reported_at: Timestamp | None = None

    def assign(self, timestamp: Timestamp, actor: Actor) -> "Review":
        return self.moved(ReviewLifecycle.assign)

    def approve(self, timestamp: Timestamp, actor: Actor, report: str) -> "Review":
        return self.moved(ReviewLifecycle.approve, report=report, reported_at=timestamp)

    def reject(self, timestamp: Timestamp, actor: Actor, report: str) -> "Review":
        return self.moved(ReviewLifecycle.reject, report=report, reported_at=timestamp)

    def leave_undecided(self, timestamp: Timestamp, actor: Actor, report: str) -> "Review":
        return self.moved(ReviewLifecycle.leave_undecided, report=report, reported_at=timestamp)

    def abandon(self, timestamp: Timestamp, actor: Actor) -> "Review":
        return self.moved(ReviewLifecycle.abandon)
