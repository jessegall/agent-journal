import time

import agents.control
from controllers.types import Agents
from tests.conftest import fresh
from tests.kit import nudges, report, tick


def test_a_command_holding_the_terminal_too_long_is_moved_to_the_background(monkeypatch):
    record = fresh()
    moved = []
    monkeypatch.setattr(agents.control, "move_to_background", lambda root, env, session: moved.append(session) or {"queued": True})
    started = time.time() - 45
    report(record, "working", "PreToolUse", provider="claude", commands=[{"command": "npm test", "tool": "Bash", "at": started}])
    tick(record)
    tick(record)
    assert (moved, [n for n in nudges(record) if "moved to the background" in n]) == \
        (["claude-1"], ["your command ran 45s in the foreground and was moved to the background"]), \
        "moved once, and the agent is told"


def test_the_engine_clock_reaches_the_session_the_hooks_report_on(monkeypatch):
    from types import SimpleNamespace
    from runner.engine import Engine
    from providers import DRIVERS
    record = fresh()
    moved = []
    monkeypatch.setattr(agents.control, "move_to_background", lambda root, env, session: moved.append(session) or {"queued": True})
    report(record, "working", "PreToolUse", session="conversation-1", provider="claude", commands=[{"command": "sleep 40", "tool": "Bash", "at": time.time() - 31}])
    engine = Engine(record, DRIVERS["claude"](record, "claude-99"))
    engine.agent.driver.last_report = lambda: SimpleNamespace(title="conversation-1", asking={})
    engine.clock()
    assert moved, "the launcher's seat is claude-99, the hooks report on conversation-1: the clock ticks for the one with the command"


def test_a_background_command_the_hook_refused_is_not_counted_as_running(tmp_path):
    import json
    from providers.claude import Claude

    def use(n, background=True):
        return {"type": "assistant", "timestamp": "2026-09-23T00:00:00Z",
                "message": {"content": [{"type": "tool_use", "id": f"t{n}", "name": "Bash", "input": {"command": f"sleep {n}", "run_in_background": background}}]}}

    def result(n, error, content="started"):
        return {"type": "user", "timestamp": "2026-09-23T00:00:01Z",
                "message": {"content": [{"type": "tool_result", "tool_use_id": f"t{n}", "is_error": error, "content": "hook error" if error else content}]}}

    transcript = tmp_path / "s.jsonl"
    moved = "Command was manually backgrounded by user with ID: b3x. Output is being written to: /tmp/b3x.output"
    rows = (use(1), result(1, True), use(2), result(2, False), use(3, False), result(3, False, moved), use(4, False), result(4, False, "done"))
    transcript.write_text("\n".join(json.dumps(row) for row in rows) + "\n")
    shells = {row["command"]: row["running"] for row in Claude().crew(transcript)["shell_rows"]}
    assert shells == {"sleep 1": False, "sleep 2": True, "sleep 3": True}, \
        "a refused call never started; one that started, or was moved to the background, runs until it ends"


def test_a_command_from_the_terminal_view_is_typed_into_the_agents_terminal_as_a_shell_command(monkeypatch):
    from runner import engine as engine_module
    from runner.engine import Engine
    from providers import DRIVERS
    record = fresh()
    report(record, "idle", "Stop")
    engine = Engine(record, DRIVERS["claude"](record, "claude-1"))
    typed = []
    monkeypatch.setattr(engine.agent.driver, "_wrote", lambda raw: typed.append(raw) or True)
    monkeypatch.setattr(engine_module.time, "sleep", lambda seconds: None)
    monkeypatch.setattr(engine.agent, "state", lambda: "busy")
    from controllers.types import Agents
    from agents import control
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
    from engine.gates import CANCELERS, LONG_COMMAND
    from engine.reach import Guard, Reach
    from resources.base import SYSTEM
    record = fresh()
    moved = []
    monkeypatch.setattr(agents.control, "move_to_background", lambda root, env, session: moved.append(session) or {"queued": True})
    report(record, "working", "PreToolUse", provider="claude", commands=[{"command": "npm run build", "tool": "Bash", "at": time.time() - 45}])
    keep = lambda call, data: "the build must stay in view"
    keep.guard = Guard("Keep the build in view", Reach.MAIN)
    CANCELERS.setdefault(LONG_COMMAND, []).append(keep)
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


def test_a_message_typed_while_codex_runs_a_command_is_sent_at_once_and_only_once(monkeypatch):
    from providers import DRIVERS, drivers
    from engine import runtime
    record = fresh()
    driver = DRIVERS["codex"](record, "codex-1")
    screen = runtime.session_file(record.root, "codex-1", "screen")
    screen.parent.mkdir(parents=True, exist_ok=True)
    screen.write_bytes(b"\x1b[2m1 background terminal running\x1b[0m")
    typed = []

    def wrote(raw: bytes) -> bool:
        typed.append(raw)
        if raw == b"\r":
            with screen.open("ab") as printed:
                printed.write(b"Messages to be submitted after next tool call\r\n  1 background terminal running")
        return True
    monkeypatch.setattr(driver, "_wrote", wrote)
    monkeypatch.setattr(drivers.time, "sleep", lambda seconds: None)
    assert driver.send("1 new message 6", now=True) is True, "a message Codex queues counts as delivered, so it is never typed again"
    assert (typed[-1], typed.count(b"\r"), driver.sent_now > 0) == (b"\x1b", 1, True), \
        "Esc sends it now, while the command runs on in its background terminal, and the engine can say so in the chat"


def test_a_codex_agent_hears_once_about_each_turn_of_the_command_it_left_running():
    import json
    from datetime import datetime, timezone
    record = fresh()
    transcript = record.root / "codex.jsonl"
    stamp = lambda at: datetime.fromtimestamp(at, timezone.utc).isoformat().replace("+00:00", "Z")
    started = time.time() - 700
    transcript.write_text("".join(json.dumps(line) + "\n" for line in (
        {"timestamp": stamp(started), "type": "response_item", "payload": {"type": "custom_tool_call", "call_id": "c1", "name": "exec",
                                                                             "input": 'const r=await tools.exec_command({cmd:"make test",yield_time_ms:1000});text(r);'}},
        {"timestamp": stamp(started), "type": "response_item", "payload": {"type": "custom_tool_call_output", "call_id": "c1",
                                                                             "output": [{"type": "input_text", "text": '{"chunk_id":"a","session_id":42,"output":""}'}]}},
        {"timestamp": stamp(started), "type": "response_item", "payload": {"type": "custom_tool_call", "call_id": "c3", "name": "exec",
                                                                             "input": "const r=await tools.exec_command({cmd:'npm run watch'});text(r);"}},
        {"timestamp": stamp(started), "type": "response_item", "payload": {"type": "custom_tool_call_output", "call_id": "c3",
                                                                             "output": [{"type": "input_text", "text": '{"chunk_id":"b","session_id":50,"output":""}'}]}},
        {"timestamp": stamp(time.time() - 60), "type": "response_item", "payload": {"type": "custom_tool_call_output", "call_id": "c4",
                                                                                      "output": [{"type": "input_text", "text": '{"chunk_id":"c","session_id":50,"output":"compiled"}'}]}},
        {"timestamp": stamp(started), "type": "response_item", "payload": {"type": "custom_tool_call", "call_id": "c2", "name": "exec",
                                                                             "input": 'const r=await tools.list_files({path:"."});text(r);'}},
        {"timestamp": stamp(started), "type": "response_item", "payload": {"type": "custom_tool_call_output", "call_id": "c2",
                                                                             "output": [{"type": "input_text", "text": '{"session_id":77}'}]}})))
    lines = lambda: [n for n in nudges(record) if "make test" in n]
    report(record, "idle", "Stop", provider="codex", transcript=str(transcript))
    tick(record)
    tick(record)
    assert [any("npm run watch" in n for n in nudges(record) if "still runs" in n), any("nothing new" in n and "npm run watch" in n for n in nudges(record))] == \
        [True, False], "a command that printed a minute ago is open but not stalled, single quotes or double"
    assert lines() == ["a command you left running has shown nothing new for 11 minutes - make test", "you stopped while a command you started still runs - make test"], \
        "a run open past ten minutes and an agent stopped while it runs are each told once"
    with transcript.open("a") as more:
        more.write(json.dumps({"timestamp": stamp(time.time()), "type": "event_msg", "payload": {
            "type": "item_completed", "item": {"type": "CommandExecution", "process_id": "42", "status": "failed"}, "completed_at_ms": time.time() * 1000}}) + "\n")
    tick(record)
    tick(record)
    assert lines()[2:] == ["the command you left running failed - make test"], "its end is told once"
    with transcript.open("a") as more:
        more.write(json.dumps({"timestamp": stamp(time.time()), "type": "event_msg", "payload": {
            "type": "item_completed", "item": {"type": "CommandExecution", "process_id": "43", "status": "completed",
                                               "command": ["/bin/zsh", "-lc", "(make test) >/dev/null 2>&1 & echo $!"], "stdout": "999999"}}}) + "\n")
    tick(record)
    assert lines()[3:] == ["the command you left running finished - make test"], "a command it detached is followed by its pid, and told once it is gone"
    report(record, "idle", "Stop", session="claude-2", provider="claude", transcript=str(transcript))
    assert len(lines()) == 4, "a provider that wakes its agent itself is left to do so"
