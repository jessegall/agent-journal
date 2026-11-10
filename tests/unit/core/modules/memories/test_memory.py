import pytest

from engine.errors.refusal import Refusal
from engine.actor.actor import Actor
from core.base.timestamp import Timestamp
from core.modules.memories.models.memory import HIGHEST_WEIGHT, LOWEST_WEIGHT, TEXT_LIMIT_CHARACTERS, Memory


def memory(**fields: object) -> Memory:
    return Memory(**{"environment_id": 1, "creator_id": 1, "text": "The cart total is cents.", **fields})


def test_a_weight_outside_0_to_10_is_refused():
    with pytest.raises(Refusal):
        memory(weight=HIGHEST_WEIGHT + 1)
    with pytest.raises(Refusal):
        memory(weight=LOWEST_WEIGHT - 1)


def test_a_text_that_is_empty_or_past_the_limit_is_refused():
    with pytest.raises(Refusal):
        memory(text="")
    with pytest.raises(Refusal):
        memory(text="x" * (TEXT_LIMIT_CHARACTERS + 1))


def test_fading_lowers_the_weight_by_one_and_never_below_0():
    timestamp = Timestamp.parsed("2026-11-03T12:00:00+00:00")
    assert memory(weight=5).faded(timestamp, Actor.core()).weight == 4
    assert memory(weight=LOWEST_WEIGHT).faded(timestamp, Actor.core()).weight == LOWEST_WEIGHT


def test_memories_live_in_the_memories_table():
    assert Memory.table == "memories"
