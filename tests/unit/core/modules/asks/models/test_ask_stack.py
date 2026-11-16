import json

import pytest

from engine.errors.refusal import Refusal
from core.modules.asks.models.ask_level import AskLevel
from core.modules.asks.models.ask_stack import AskStack


def stack(*levels: dict) -> AskStack:
    return AskStack(id=1, version=1, creator_id=1, topic="general", levels_json=json.dumps(list(levels)))


def test_keeps_order():
    assert [level.profile for level in stack({"profile": "overseer"}, {"profile": "journal-merger"}).levels()] == ["overseer", "journal-merger"]


def test_duplicate_profile_refused():
    with pytest.raises(Refusal) as refused:
        stack({"profile": "overseer"}, {"profile": "overseer"})
    assert refused.value.reason == "overseer is in the stack twice: a question visits each profile once"


def test_parent_listed_refused():
    with pytest.raises(Refusal) as refused:
        stack({"profile": "overseer"}, {"profile": "parent"})
    assert refused.value.reason == "the asker's parent is always the bottom: leave it out"


def test_per_level_minutes_parsed():
    assert stack({"profile": "overseer", "answer_minutes": 5, "pass_minutes": 8}).levels() == (AskLevel("overseer", 5, 8),)


def test_level_without_minutes_uses_defaults():
    assert stack({"profile": "overseer"}).levels() == (AskLevel("overseer", None, None),)


def test_pass_shorter_than_answer_refused():
    with pytest.raises(Refusal) as refused:
        stack({"profile": "overseer", "answer_minutes": 10, "pass_minutes": 3})
    assert "passes on after 3 minutes, before the 10 minutes" in refused.value.reason
