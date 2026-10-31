from dataclasses import dataclass

from core.base.actor import Actor
from core.base.model.model import Model
from core.base.timestamp import Timestamp
from core.modules.reviews.models.enums.review_state import ReviewState
from core.modules.reviews.models.lifecycles.review_lifecycle import ReviewLifecycle


@dataclass(frozen=True, kw_only=True)
class Review(Model):
    """One request to have a row's work checked, point by point; its state moves only as ReviewLifecycle allows."""

    model_name = "review"
    cli_name = "review"
    lifecycle = ReviewLifecycle

    environment_id: int
    subject_model: str
    subject_id: int
    requester_id: int
    reviewer_id: int | None = None
    brief: str = ""
    point_count: int
    state: ReviewState = ReviewState.QUEUED
    report: str = ""
    reported_at: Timestamp | None = None

    def assign(self, timestamp: Timestamp, actor: Actor, reviewer_id: int) -> "Review":
        return self.moved(ReviewLifecycle.assign, reviewer_id=reviewer_id)

    def approve(self, timestamp: Timestamp, actor: Actor, report: str) -> "Review":
        return self.moved(ReviewLifecycle.approve, report=report, reported_at=timestamp)

    def send_back(self, timestamp: Timestamp, actor: Actor, report: str) -> "Review":
        return self.moved(ReviewLifecycle.send_back, report=report, reported_at=timestamp)

    def leave_undecided(self, timestamp: Timestamp, actor: Actor, report: str) -> "Review":
        return self.moved(ReviewLifecycle.leave_undecided, report=report, reported_at=timestamp)

    def abandon(self, timestamp: Timestamp, actor: Actor) -> "Review":
        return self.moved(ReviewLifecycle.abandon)
