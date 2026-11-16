import json

from core.modules.asks.models.helper_question import HelperQuestion
from core.modules.asks.models.support.ask_level import AskLevel
from engine.time.timestamp import Timestamp

STACK = json.dumps([{"profile": "overseer", "answer_minutes": 5, "pass_minutes": 2}, {"profile": "journal-merger", "answer_minutes": 10, "pass_minutes": 3}])


def sample_question(**fields) -> HelperQuestion:
    return HelperQuestion(id=1, version=1, creator_id=1, asker_id=7, parent_id=3, topic="general", text="Which test file?", stack_json=STACK, **fields)


def test_levels_parsed():
    assert sample_question().levels() == (AskLevel("overseer", 5, 2), AskLevel("journal-merger", 10, 3))


def test_at_parent_when_index_past_levels():
    assert not sample_question(level_index=1).is_parent_level
    assert sample_question(level_index=2).is_parent_level


def test_open_until_closed():
    assert sample_question().is_open
    assert not sample_question(closed_at=Timestamp.parsed("2026-11-14T06:00:00+00:00")).is_open
