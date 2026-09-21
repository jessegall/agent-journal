import json

import pytest

import features
from controllers.types import Agents
from engine.actors import COMPACTING, STATES
from engine.drivers import DRIVERS
from engine.engine import Engine
from engine.hooks import EVENTS, handle
from providers import PROVIDERS
from resources.base import SYSTEM
from tests.conftest import fresh


@pytest.fixture(autouse=True)
def loaded_features():
    features.unload()
    features.load()
    yield
    features.unload()


def test_a_native_compaction_hook_marks_the_session_compacting_then_idle():
    record = fresh()
    provider = PROVIDERS["claude"]()
    assert ("PreCompact" in EVENTS and "PreCompact" in provider.wiring("x")["hooks"]) is True, \
        "PreCompact is a wired hook event"
    handle(provider, record.root, record.env, {"hook_event_name": "PreToolUse", "session_id": "s-1", "tool_name": "Read"})
    handle(provider, record.root, record.env, {"hook_event_name": "PreCompact", "session_id": "s-1"})
    row = Agents(record, actor=SYSTEM).by_session("s-1")
    assert (row.data["status"], COMPACTING in STATES) == (COMPACTING, True), "the report says compacting, a state of its own"
    handle(provider, record.root, record.env, {"hook_event_name": "SessionStart", "session_id": "s-1", "source": "compact"})
    assert Agents(record, actor=SYSTEM).by_session("s-1").data["status"] == "idle", "the start after it is idle again"


def test_codex_transcript_compaction_marks_the_session_and_clears_on_resumed_activity(tmp_path):
    record = fresh()
    transcript = tmp_path / "rollout.jsonl"
    transcript.write_text(json.dumps({"type": "session_meta", "payload": {"source": {}}}) + "\n")
    driver = DRIVERS["codex"](record, "codex-1", fd=1)
    codex = PROVIDERS["codex"]()
    handle(codex, record.root, record.env, {"hook_event_name": "UserPromptSubmit", "session_id": "codex-1", "transcript_path": str(transcript)})
    engine = Engine(record, driver)
    with transcript.open("a") as out:
        out.write(json.dumps({"type": "compacted", "payload": {}}) + "\n")
    engine.crew()
    assert Agents(record, actor=SYSTEM).by_session("rollout").status == COMPACTING, \
        "Codex transcript compaction marks the session compacting without a native hook"
    with transcript.open("a") as out:
        out.write(json.dumps({"type": "response_item", "payload": {"type": "reasoning"}}) + "\n")
    engine.crewed_at = 0
    engine.crew()
    assert Agents(record, actor=SYSTEM).by_session("rollout").status == "working", \
        "Codex leaves compacting when native assistant activity resumes"
