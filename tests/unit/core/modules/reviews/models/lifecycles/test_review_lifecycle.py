from datetime import datetime, timezone

import pytest

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.time.timestamp import Timestamp
from core.modules.reviews.models.enums.review_state import ReviewState
from core.modules.reviews.models.lifecycles.review_lifecycle import ReviewLifecycle
from core.modules.reviews.models.review import Review

FIXED_TIME = Timestamp(datetime(2026, 10, 31, tzinfo=timezone.utc))
ACTOR = Actor(2, ActorType.AGENT)
QUEUED = Review(id=1, version=1, environment_id=1, subject_model="task", subject_id=1, requester_id=1, point_count=2)


def test_a_review_starts_queued():
    assert QUEUED.state == ReviewState.QUEUED
    assert ReviewLifecycle.initial == [ReviewState.QUEUED]


def test_assigning_a_queued_review_moves_it_to_reviewing():
    reviewing = QUEUED.assign(FIXED_TIME, ACTOR)
    assert reviewing.state == ReviewState.REVIEWING


@pytest.mark.parametrize(("method", "state"), [("approve", ReviewState.APPROVED), ("reject", ReviewState.REJECTED), ("leave_undecided", ReviewState.UNDECIDED)])
def test_a_report_ends_the_review_and_keeps_its_text(method: str, state: ReviewState):
    reported = getattr(QUEUED.assign(FIXED_TIME, ACTOR), method)(FIXED_TIME, ACTOR, "1 passed")
    assert (reported.state, reported.report, reported.reported_at) == (state, "1 passed", FIXED_TIME)


def test_only_a_review_being_reviewed_can_be_reported():
    for move in (ReviewLifecycle.approve, ReviewLifecycle.reject, ReviewLifecycle.leave_undecided):
        assert list(move.sources) == [ReviewState.REVIEWING]


def test_a_review_is_abandoned_while_queued_or_reviewing():
    assert QUEUED.abandon(FIXED_TIME, ACTOR).state == ReviewState.ABANDONED
    assert QUEUED.assign(FIXED_TIME, ACTOR).abandon(FIXED_TIME, ACTOR).state == ReviewState.ABANDONED
