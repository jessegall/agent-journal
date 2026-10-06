import features
from controllers.types import Agents, Nudges, Works
from features.session_briefing.start import start_block
from features.work_modes.details import NAME
from features.work_modes.modes import mode_of, pick
from providers import PROVIDERS
from resources.base import AGENT, SYSTEM, USER
from runner.hooks import handle
from tests.conftest import fresh, refused

DISPATCH = {"subagent_type": "Explore", "model": "haiku", "description": "Dr. Einstein: find the slow hook"}


def called(record, tool: str, given: dict) -> dict:
    return handle(PROVIDERS["claude"](), record.root, record.env, {"hook_event_name": "PreToolUse", "session_id": "claude-1", "tool_name": tool,
                                                                  "tool_input": given, "cwd": str(record.root.parent)})


def told(record, words: str) -> list:
    return [n for n in Nudges(record, actor=SYSTEM).all() if words in n.title]


def test_a_picked_mode_is_kept_told_to_the_agent_and_carried_into_every_start():
    features.load()
    record = fresh()
    Agents(record, actor=SYSTEM).create("claude-1")
    assert mode_of(record) == "builder" and "WORK MODE" not in start_block(record), "builder is the default, and a start says nothing of it"
    assert "one of builder, orchestrator, solo" in refused(lambda: pick(record, "lazy", USER)), "only the three modes are taken"
    from commands.http import dispatch
    assert dispatch("POST", f"/api/{record.env}/mode", record.root, {}, {"mode": "lazy"}).code == 400, "the viewer's switch refuses another mode in words"
    assert dispatch("POST", f"/api/{record.env}/mode", record.root, {}, {"mode": "orchestrator"}).body == {"mode": "orchestrator"}, \
        "the viewer's mode switch picks the mode"
    assert mode_of(record) == "orchestrator" and "WORK MODE: orchestrator" in start_block(record), "the mode is kept and carried after a restart or compaction"
    assert len(told(record, "work mode to orchestrator")) == 1, "the agent is told once when it changes"
    assert NAME in [e.data.get("setting") for e in record.event_log.events()], "the viewer hears the change and follows it"
    pick(record, "orchestrator", USER)
    assert len(told(record, "work mode to orchestrator")) == 1, "picking the same mode again tells nothing"


def test_solo_refuses_a_subagent_and_a_helper_and_hands_on_lets_both_through():
    features.load()
    record = fresh()
    helper = {"command": 'journal helper dispatch Rhea "a job" --provider codex --model gpt-5.5'}
    assert called(record, "Agent", DISPATCH) == {}, "builder lets a subagent through"
    assert "solo" not in called(record, "Bash", helper).get("reason", ""), "builder lets a helper through"
    pick(record, "solo", USER)
    assert "set this environment to solo" in called(record, "Agent", DISPATCH).get("reason", ""), "solo refuses a subagent"
    assert "set this environment to solo" in called(record, "Bash", helper).get("reason", ""), "solo refuses a helper"


def test_orchestrator_reminds_the_agent_after_its_own_edits_and_hands_on_never(monkeypatch):
    features.load()
    record = fresh()
    Agents(record, actor=SYSTEM).create("claude-1")
    Works(record, actor=AGENT).create("a piece of work")
    edit = {"file_path": str(record.root.parent / "code.py"), "old_string": "a", "new_string": "b"}
    for _ in range(9):
        called(record, "Edit", edit)
    assert not told(record, "orchestrator here"), "builder is never reminded"
    pick(record, "orchestrator", USER)
    for _ in range(7):
        called(record, "Edit", edit)
    assert not told(record, "orchestrator here"), "a few edits of its own are fine"
    called(record, "Edit", edit)
    assert told(record, "orchestrator here and have made 8 edits"), "the eighth edit brings a gentle reminder"


def test_an_upgrade_turns_auto_mode_on_and_renames_the_hands_on_mode():
    from migrations.m0060_auto_mode_on_everywhere import run as auto_on
    from migrations.m0061_hands_on_is_builder import run as rename

    record = fresh()
    record.set_setting("features", {"work_tracking.auto": False, "kept": True})
    record.set_setting(NAME, {"mode": "hands-on", "other": 1})
    assert auto_on(record.root) == ["t: auto mode on"], "an environment that switched auto mode off gets it back"
    assert record.setting("features") == {"work_tracking.auto": True, "kept": True}, "only auto mode changes"
    assert auto_on(record.root) == [], "an environment with auto mode on is left alone"
    assert rename(record.root) == ["t: the work mode hands-on is now builder"], "the old mode name is renamed"
    assert record.setting(NAME) == {"mode": "builder", "other": 1}, "the other work-mode settings stay"
    assert rename(record.root) == [], "a mode that is already named builder is left alone"
