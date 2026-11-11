import json

from core.modules.codex.providers.support.codex_turn_effort import CodexTurnEffort


def test_a_turn_context_line_gives_its_effort():
    assert CodexTurnEffort.parsed(json.dumps({"type": "turn_context", "payload": {"model": "gpt-6.1-sol", "effort": "medium"}})) == "medium"


def test_a_turn_context_line_gives_its_model_when_asked_for_it():
    assert CodexTurnEffort.parsed(json.dumps({"type": "turn_context", "payload": {"model": "gpt-6.1-sol", "effort": "medium"}}), "model") == "gpt-6.1-sol"


def test_any_other_line_gives_none():
    assert CodexTurnEffort.parsed(json.dumps({"type": "event_msg", "payload": {"effort": "medium"}})) == ""
    assert CodexTurnEffort.parsed("") == ""
