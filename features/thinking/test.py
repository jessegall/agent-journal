import json

from controllers.types import Agents, Messages
from features import load
from tests.conftest import fresh
from tests.kit import report


def test_the_latest_thought_is_shown_live_and_kept_only_when_nothing_answered_it(tmp_path):
    load()
    record, transcript = fresh(), tmp_path / "s.jsonl"
    rows = lambda key, *parts: json.dumps({"type": "assistant", "message": {"id": key, "content": [*parts, {"type": "tool_use", "name": "Bash"}]}}) + "\n"
    hook = lambda event: report(record, "working", event, provider="claude", transcript=str(transcript))
    transcript.write_text(rows("m0", {"type": "text", "text": "before"}))
    hook("PreToolUse")
    transcript.write_text(transcript.read_text() + rows("m1", {"type": "thinking", "thinking": ""}, {"type": "thinking", "thinking": "Hidden words"}))
    hook("PostToolUse")
    assert (Agents(record, actor="system").by_session("claude-1").data.get("thinking"), Messages(record, actor="system").all()) == ("Hidden words", []), "shown live, not yet kept"
    hook("UserPromptSubmit")
    transcript.write_text(transcript.read_text() + rows("m2", {"type": "thinking", "thinking": "Reasoning"}) + rows("m3", {"type": "text", "text": "Shown"}))
    for event in ("PostToolUse", "UserPromptSubmit"):
        hook(event)
    assert [(m.brief, m.data.get("thinking")) for m in Messages(record, actor="system").all()] == [("Hidden words", True)], "a thought a message answered is not kept"
