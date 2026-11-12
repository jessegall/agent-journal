import json

from core.modules.codex.providers.support.codex_session_effort import CodexSessionEffort


def test_effort_survives_long_turns_and_changes_only_after_a_complete_context_record(tmp_path):
    path = tmp_path / "session.jsonl"
    reader = CodexSessionEffort(path)
    assert reader.read() == ""
    path.write_text(json.dumps({"type": "turn_context", "payload": {"effort": "high"}}) + "\n")
    assert reader.read() == "high"
    with path.open("a") as stream:
        stream.write((json.dumps({"type": "event_msg", "payload": {"text": "x" * 1000}}) + "\n") * 300)
        stream.write('{"type":"turn_context","payload":{"effort":"medium"}')
    assert reader.read() == "high"
    with path.open("a") as stream:
        stream.write("}\n")
    assert reader.read() == "medium"
    assert reader.read() == "medium"
    path.write_text(json.dumps({"type": "turn_context", "payload": {"effort": "low"}}) + "\n")
    assert reader.read() == "low"
    path.unlink()
    assert reader.read() == ""


def test_missing_effort_and_an_unfinished_first_record_return_no_effort(tmp_path):
    path = tmp_path / "session.jsonl"
    reader = CodexSessionEffort(path)
    path.write_text('{"type":"turn_context","payload":{"effort":"high"}}')
    assert reader.read() == ""
    path.write_text('{"type":"event_msg","payload":{}}\n' * 12000)
    assert reader.read() == ""
