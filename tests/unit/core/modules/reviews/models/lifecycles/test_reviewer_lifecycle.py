import pytest

from datetime import datetime, timezone

from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.model.model_error import ModelError
from core.base.timestamp import Timestamp
from core.modules.reviews.models.enums.reviewer_state import ReviewerState
from core.modules.reviews.models.reviewer import Reviewer

NOW = Timestamp(datetime(2026, 10, 31, tzinfo=timezone.utc))
ACTOR = Actor(2, ActorType.AGENT)
IDLE = Reviewer(id=5, version=1, environment_id=1, creator_id=1, program="claude")


def test_a_reviewer_starts_idle_takes_a_review_and_goes_idle_again():
    reviewing = IDLE.take(NOW, ACTOR)
    assert reviewing.state == ReviewerState.REVIEWING
    assert reviewing.finish(NOW, ACTOR).state == ReviewerState.IDLE


def test_only_an_idle_reviewer_retires():
    assert IDLE.retire(NOW, ACTOR).state == ReviewerState.RETIRED
    with pytest.raises(ModelError):
        IDLE.take(NOW, ACTOR).retire(NOW, ACTOR)


def test_a_reviewer_ends_idle_or_reviewing():
    assert IDLE.end(NOW, ACTOR).state == ReviewerState.ENDED
    assert IDLE.take(NOW, ACTOR).end(NOW, ACTOR).state == ReviewerState.ENDED
