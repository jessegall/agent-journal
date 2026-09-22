import json

from controllers.types import Agents, Messages
from features import load
from tests.conftest import fresh
from tests.kit import report


def test_the_latest_thought_shows_live_and_never_becomes_a_chat_message(tmp_path):
    load()
    record, transcript = fresh(), tmp_path / "s.jsonl"
    rows = lambda key, *parts: json.dumps({"type": "assistant", "message": {"id": key, "content": [*parts, {"type": "tool_use", "name": "Bash"}]}}) + "\n"
    hook = lambda event: report(record, "working", event, provider="claude", transcript=str(transcript))
    thought = lambda: Agents(record, actor="system").by_session("claude-1").data.get("thinking")
    transcript.write_text(rows("m0", {"type": "text", "text": "before"}))
    hook("PreToolUse")
    transcript.write_text(transcript.read_text() + rows("m1", {"type": "thinking", "thinking": ""}, {"type": "thinking", "thinking": "First"})
                          + rows("m2", {"type": "thinking", "thinking": "Second"}))
    hook("PostToolUse")
    assert thought() == "Second", "the latest thought is shown, the one before it replaced"
    transcript.write_text(transcript.read_text() + rows("m3", {"type": "text", "text": "Shown"}))
    hook("PostToolUse")
    assert thought() == "", "a visible message clears it"
    transcript.write_text(transcript.read_text() + rows("m4", {"type": "thinking", "thinking": "Third"}))
    for event in ("PostToolUse", "UserPromptSubmit"):
        hook(event)
    assert (thought(), Messages(record, actor="system").all()) == ("", []), "the next turn clears it, and no thought ever becomes a chat message"
