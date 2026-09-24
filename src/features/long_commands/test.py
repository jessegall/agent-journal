import time

import surfaces.control
from controllers.types import Agents
from tests.conftest import fresh
from tests.kit import nudges, report, tick


def test_a_command_holding_the_terminal_too_long_is_moved_to_the_background(monkeypatch):
    record = fresh()
    moved = []
    monkeypatch.setattr(surfaces.control, "move_to_background", lambda root, env, session: moved.append(session) or {"queued": True})
    started = time.time() - 45
    report(record, "working", "PreToolUse", provider="claude", commands=[{"command": "npm test", "tool": "Bash", "at": started}])
    tick(record)
    tick(record)
    assert (moved, [n for n in nudges(record) if "moved to the background" in n]) == \
        (["claude-1"], ["your command ran 45s in the foreground and was moved to the background"]), \
        "moved once, and the agent is told"


def test_the_engine_clock_reaches_the_session_the_hooks_report_on(monkeypatch):
    from types import SimpleNamespace
    from engine.engine import Engine
    from providers import DRIVERS
    record = fresh()
    moved = []
    monkeypatch.setattr(surfaces.control, "move_to_background", lambda root, env, session: moved.append(session) or {"queued": True})
    report(record, "working", "PreToolUse", session="conversation-1", provider="claude", commands=[{"command": "sleep 40", "tool": "Bash", "at": time.time() - 31}])
    engine = Engine(record, DRIVERS["claude"](record, "claude-99"))
    engine.agent.driver.last_report = lambda: SimpleNamespace(title="conversation-1")
    engine.clock()
    assert moved, "the launcher's seat is claude-99, the hooks report on conversation-1: the clock ticks for the one with the command"


def test_a_background_command_the_hook_refused_is_not_counted_as_running(tmp_path):
    import json
    from providers.claude import Claude

    def use(n):
        return {"type": "assistant", "timestamp": "2026-09-23T00:00:00Z",
                "message": {"content": [{"type": "tool_use", "id": f"t{n}", "name": "Bash", "input": {"command": f"sleep {n}", "run_in_background": True}}]}}

    def result(n, error):
        return {"type": "user", "timestamp": "2026-09-23T00:00:01Z",
                "message": {"content": [{"type": "tool_result", "tool_use_id": f"t{n}", "is_error": error, "content": "hook error" if error else "started"}]}}

    transcript = tmp_path / "s.jsonl"
    transcript.write_text("\n".join(json.dumps(row) for row in (use(1), result(1, True), use(2), result(2, False))) + "\n")
    shells = {row["command"]: row["running"] for row in Claude().crew(transcript)["shell_rows"]}
    assert shells == {"sleep 1": False, "sleep 2": True}, "a refused call never started; one that started runs until it ends"


def test_a_command_from_the_terminal_view_is_typed_into_the_agents_terminal_as_a_shell_command(monkeypatch):
    from engine import engine as engine_module
    from engine.engine import Engine
    from providers import DRIVERS
    record = fresh()
    report(record, "idle", "Stop")
    engine = Engine(record, DRIVERS["claude"](record, "claude-1"))
    typed = []
    monkeypatch.setattr(engine.agent.driver, "_wrote", lambda raw: typed.append(raw) or True)
    monkeypatch.setattr(engine_module.time, "sleep", lambda seconds: None)
    monkeypatch.setattr(engine.agent, "state", lambda: "busy")
    from controllers.types import Agents
    from surfaces import control
    import os, time
    from engine import runtime
    from engine.stored import write_json
    seat = runtime.session_file(record.root, "claude-1", "seat.json")
    reloading = time.time() - 30
    write_json(seat, {"at": reloading, "agent": "claude", "env": record.env, "report": {"title": "claude-1", "provider": "claude"}})
    os.utime(seat, (reloading, reloading))
    control.shell(record.root, record.env, "claude-1", "git status")
    pending = lambda: [c["command"] for c in Agents(record).by_session("claude-1").data.get("queued_commands") or []]
    assert pending() == ["git status"], "queued for a session seen moments ago, as during a reload, and pending until typed"
    assert engine.shelled() == "typed in the terminal: git status"
    assert pending() == ["git status"], "typed while the agent works, since Claude queues it, and pending until it runs"
    import json
    from datetime import datetime, timezone
    transcript = record.root / "transcript.jsonl"
    ran_at = datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")
    transcript.write_text(json.dumps({"type": "user", "timestamp": ran_at, "message": {"role": "user", "content": "<bash-input>git status</bash-input>"}}) + "\n")
    Agents(record).update(Agents(record).by_session("claude-1").n, transcript=str(transcript), provider="claude")
    engine.agent.driver.reported = (float("-inf"), None)
    engine.ran()
    assert pending() == [], "no longer pending once the transcript shows it ran"
    Agents(record).update(Agents(record).by_session("claude-1").n, asking={"tool": "Bash"})
    engine.agent.driver.reported = (float("-inf"), None)
    control.shell(record.root, record.env, "claude-1", "ls")
    assert engine.shelled() == "" and pending() == ["ls"], "held while a permission prompt would take the keys"
    assert typed[-2:] == [b"!git status", b"\r"], "typed with Claude's shell mark and entered once, with no journal mark in front"
    Agents(record).update(Agents(record).by_session("claude-1").n, asking={})
    engine.agent.driver.reported = (float("-inf"), None)
    control.shell(record.root, record.env, "claude-1", "/effort high")
    engine.shelled()
    engine.shelled()
    lines = [raw for raw in typed if raw.strip(b"\x05\x15\x7f\r")]
    assert (lines[-1], b"!/effort high" in typed, "/effort high" in pending()) == (b"/effort high", False, False), \
        "a line starting with / is a command for the agent: typed as it is, and not waited on as a shell command"
    assert DRIVERS["codex"].SHELL == "", "a provider without a shell mark takes no command"


def test_a_long_command_is_an_event_a_feature_can_cancel_and_a_move_shows_in_the_chat(monkeypatch):
    from controllers.types import Agents
    from engine.hooks import CANCELERS, LONG_COMMAND
    from resources.base import SYSTEM
    record = fresh()
    moved = []
    monkeypatch.setattr(surfaces.control, "move_to_background", lambda root, env, session: moved.append(session) or {"queued": True})
    report(record, "working", "PreToolUse", provider="claude", commands=[{"command": "npm run build", "tool": "Bash", "at": time.time() - 45}])
    CANCELERS.setdefault(LONG_COMMAND, []).append(lambda provider, record, hook, session, data: "the build must stay in view")
    try:
        tick(record)
    finally:
        CANCELERS[LONG_COMMAND].pop()
    from controllers.types import Nudges
    kept = [n.brief for n in Nudges(record).all() if n.title == "your long command stays in the foreground"]
    assert moved == [] and kept == ["it was not moved to the background because: the build must stay in view"], (moved, kept)
    report(record, "working", "PreToolUse", provider="claude", commands=[{"command": "npm test", "tool": "Bash", "at": time.time() - 45}])
    tick(record)
    cards = [c["label"] for c in Agents(record, actor=SYSTEM).by_session("claude-1").data.get("cards") or []]
    assert moved == ["claude-1"] and cards == ["Moved a long command to the background"], (moved, cards)


def test_a_long_command_keeps_one_chat_mark_whose_dot_turns_green():
    record = fresh()
    report(record, "working", "PreToolUse")
    agents = Agents(record, actor="system")
    row = agents.by_session("claude-1")
    agents.card(row.n, key="command:1", label="Moved a long command to the background", state="running")
    agents.card(row.n, key="command:1", state="done")
    cards = agents.load(row.n).data["cards"]
    assert [(c["label"], c["state"]) for c in cards] == [("Moved a long command to the background", "done")], \
        "the end updates the one mark instead of adding a second"
