from contextlib import chdir
from pathlib import Path

import pytest

import features
from engine.hooks import handle
from engine.queries import start_block
from features.law.policy import BEGIN, brief
from providers import PROVIDERS
from tests.conftest import fresh


@pytest.fixture(autouse=True)
def loaded_features():
    features.unload()
    features.load()
    yield
    features.unload()


def test_the_law_is_fixed_on_and_carried_by_every_start():
    record = fresh()
    law = features.FEATURES["law"]
    assert (law.enabled(record), law.describe()["fixed"]) == (True, True), "the law is fixed on"
    record.features = {"law": False}
    assert law.enabled(record) is True, "a setting cannot switch the law off"
    assert all(name in start_block(record) for name in ("L1", "L2")) is True, "every start carries both laws"


def test_the_briefing_writes_both_agent_files_preserving_project_text(tmp_path):
    record = fresh()
    project = record.root.parent
    (project / "CLAUDE.md").write_text("# Kept\n")
    assert [f.name for f in brief(project)] == ["AGENTS.md", "CLAUDE.md"], "the briefing writes both agent files"
    assert (project / "CLAUDE.md").read_text().startswith("# Kept\n") is True, "the briefing preserves project text"
    (project / "relative").mkdir()
    with chdir(project / "relative"):
        brief(Path("."))
    assert (project / "relative" / "AGENTS.md").read_text().splitlines()[0] == f"# {(project / 'relative').name}", \
        "a relative project path still names its briefing"
    (project / "CLAUDE.md").write_text((project / "CLAUDE.md").read_text().replace("least expensive", "edited"))
    brief(project)
    assert ((project / "CLAUDE.md").read_text().count(BEGIN), "edited" in (project / "CLAUDE.md").read_text()) == (1, False), \
        "the managed block is restored once"


def test_the_law_refuses_an_unbounded_dispatch_and_allows_a_bounded_one():
    record = fresh()
    cases = (("claude", "Agent", {"subagent_type": "general-purpose", "model": "sonnet"}),
             ("claude", "Agent", {"subagent_type": "Explore"}),
             ("codex", "collaboration.spawn_agent", {"task_name": "general", "model": "gpt-5.6-luna"}),
             ("codex", "collaboration.spawn_agent", {"task_name": "search_history"}))
    for name, tool, given in cases:
        result = handle(PROVIDERS[name](), record.root, record.env, {"hook_event_name": "PreToolUse", "session_id": f"{name}-law", "tool_name": tool, "tool_input": given})
        assert result.get("decision") == "block", f"{name}: the law refuses an invalid dispatch"

    allowed = (("claude", "Agent", {"subagent_type": "Explore", "model": "haiku"}),
               ("codex", "collaboration.spawn_agent", {"task_name": "search_history", "model": "gpt-5.6-luna"}))
    for name, tool, given in allowed:
        result = handle(PROVIDERS[name](), record.root, record.env, {"hook_event_name": "PreToolUse", "session_id": f"{name}-law", "tool_name": tool, "tool_input": given})
        assert result == {}, f"{name}: a bounded dispatch with a model goes through"
