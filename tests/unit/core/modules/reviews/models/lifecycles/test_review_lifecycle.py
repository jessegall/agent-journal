from datetime import datetime, timezone

import pytest

from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.model.model_error import ModelError
from core.base.timestamp import Timestamp
from core.modules.reviews.models.enums.review_state import ReviewState
from core.modules.reviews.models.lifecycles.review_lifecycle import ReviewLifecycle
from core.modules.reviews.models.review import Review

NOW = Timestamp(datetime(2026, 10, 31, tzinfo=timezone.utc))
ACTOR = Actor(2, ActorType.AGENT)
QUEUED = Review(id=1, version=1, environment_id=1, subject_model="task", subject_id=1, requester_id=1, point_count=2)


def test_a_review_starts_queued_with_no_reviewer():
    assert (QUEUED.state, QUEUED.reviewer_id) == (ReviewState.QUEUED, None)
    assert ReviewLifecycle.initial == [ReviewState.QUEUED]


def test_assigning_a_queued_review_names_its_reviewer():
    reviewing = QUEUED.assign(NOW, ACTOR, 5)
    assert (reviewing.state, reviewing.reviewer_id) == (ReviewState.REVIEWING, 5)


@pytest.mark.parametrize(("method", "state"), [("approve", ReviewState.APPROVED), ("send_back", ReviewState.SENT_BACK), ("leave_undecided", ReviewState.UNDECIDED)])
def test_a_report_ends_the_review_and_keeps_its_text(method: str, state: ReviewState):
    reported = getattr(QUEUED.assign(NOW, ACTOR, 5), method)(NOW, ACTOR, "1 passed")
    assert (reported.state, reported.report, reported.reported_at) == (state, "1 passed", NOW)


def test_a_queued_review_cannot_be_reported():
    with pytest.raises(ModelError):
        QUEUED.moved(ReviewLifecycle.approve)


def test_a_review_is_abandoned_while_queued_or_reviewing():
    assert QUEUED.abandon(NOW, ACTOR).state == ReviewState.ABANDONED
    assert QUEUED.assign(NOW, ACTOR, 5).abandon(NOW, ACTOR).state == ReviewState.ABANDONED
