import json

from core.modules.asks.models.ask import Ask
from core.modules.asks.models.ask_level import AskLevel
from engine.time.timestamp import Timestamp

STACK = json.dumps([{"profile": "overseer", "answer_minutes": 5, "pass_minutes": 2}, {"profile": "journal-merger", "answer_minutes": 10, "pass_minutes": 3}])


def sample_ask(**fields) -> Ask:
    return Ask(id=1, version=1, creator_id=1, asker_id=7, parent_id=3, topic="general", text="Which test file?", stack_json=STACK, **fields)


def test_levels_parsed():
    assert sample_ask().levels() == (AskLevel("overseer", 5, 2), AskLevel("journal-merger", 10, 3))


def test_at_parent_when_index_past_levels():
    assert not sample_ask(level_index=1).is_at_parent
    assert sample_ask(level_index=2).is_at_parent


def test_open_until_closed():
    assert sample_ask().is_open
    assert not sample_ask(closed_at=Timestamp.parsed("2026-11-14T06:00:00+00:00")).is_open
