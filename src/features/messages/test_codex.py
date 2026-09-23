import json

from controllers.types import Agents
from engine.transcript import last_text
from tests.conftest import fresh
from tests.kit import report


def test_codex_last_text_reads_the_parsed_tail(tmp_path):
    record = fresh()
    transcript = tmp_path / "codex.jsonl"
    transcript.write_text(json.dumps({
        "type": "response_item",
        "timestamp": "2026-09-23T10:00:00Z",
        "payload": {
            "type": "message",
            "role": "assistant",
            "content": [{"type": "output_text", "text": "the response is complete"}],
        },
    }) + "\n")
    report(record, "working", "PreToolUse", session="codex-1", provider="codex", transcript=str(transcript))

    agent = Agents(record).by_session("codex-1")

    assert last_text(record, agent) == "the response is complete"
