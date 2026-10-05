from controllers.types import Agents
from runner.hooks import handle
from features.terminal.log import COMMANDS, JOURNAL, MOST_LINES, lines
from providers import PROVIDERS
from tests.conftest import fresh
from tests.kit import report


def ran(record, command: str, printed: str) -> None:
    claude, call = PROVIDERS["claude"](), {"session_id": "claude-1", "tool_name": "Bash", "tool_input": {"command": command}}
    handle(claude, record.root, record.env, {**call, "hook_event_name": "PreToolUse"})
    handle(claude, record.root, record.env, {**call, "hook_event_name": "PostToolUse", "tool_response": {"stdout": printed}})


def test_shell_commands_are_kept_with_their_output_and_journal_calls_are_left_out():
    record = fresh()
    ran(record, "seq 100", "\n".join(map(str, range(1, 101))))
    ran(record, "cd /tmp && journal message read 12", "done")
    ran(record, "journal todo all | head", "rows")
    ran(record, "tail -3 .journal/runtime/engine.log", "log")
    kept = lines(record, "claude-1", COMMANDS)
    assert [line["command"] for line in kept] == ["seq 100"], "only the shell command is kept, not the journal's own calls or reads of its folder"
    assert [line["command"] for line in lines(record, "claude-1", JOURNAL)][1:] == ["cd /tmp && journal message read 12", "journal todo all | head",
                                                                              "tail -3 .journal/runtime/engine.log"], "the journal level adds them back"
    printed = kept[0]["output"].splitlines()
    assert (printed[0], len(printed), printed[-1]) == ("1", MOST_LINES + 1, f"… {100 - MOST_LINES} more lines were not kept"), "the output is cut to its first lines"


def test_a_poll_after_the_last_line_gets_only_the_newer_ones():
    record = fresh()
    ran(record, "ls", "a")
    seen = lines(record, "claude-1", COMMANDS)[-1]["at"]
    ran(record, "pwd", "/tmp")
    assert [line["command"] for line in lines(record, "claude-1", COMMANDS, seen)] == ["pwd"], "only the line after the last one seen comes back"
    from commands.http import dispatch
    agent = Agents(record, actor="system").by_session("claude-1").n
    polled = lambda query: dispatch("GET", f"/api/{record.env}/agent/{agent}/terminal", record.root, query, {})
    assert [line["command"] for line in polled({"level": COMMANDS, "after": str(seen)}).body["lines"]] == ["pwd"], "the viewer's poll gets the same"
    assert polled({"level": "everything-and-more"}).code == 400, "a level the terminal does not know is refused"


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


def test_the_worker_stops_on_request_or_signal_reloads_when_its_session_moves_and_a_failing_check_stops_nothing(monkeypatch):
    import threading
    from pathlib import Path
    from types import SimpleNamespace
    from engine.sessions import Sessions
    from engine.stop import ask_session
    from runner import worker
    from supervisor import RELOAD, STOP
    record = fresh()
    monkeypatch.setattr(worker, "watch_change_log", lambda: None)
    monkeypatch.setattr(worker, "TICK", 0.01)
    monkeypatch.setattr(worker, "CHECKS_EVERY", 0.0)
    sessions = Sessions(record.root)
    sessions.bind("claude-1", record.env, provider="claude")
    start = lambda: worker.run(record.root, Path(record.root).parent, record.env, "claude", "claude-1")
    threading.Timer(0.3, lambda: sessions.write("claude-1", environment="elsewhere")).start()
    assert start() == RELOAD, "a session moved to another environment reloads the worker so it follows"
    sessions.write("claude-1", environment=record.env)
    ask_session(record.root, "claude-1")
    assert start() == STOP and not worker.session_flag(record.root, "claude-1").is_file(), "a stop request for the session ends the worker and is used up"
    monkeypatch.setattr(worker, "TERMINATED", SimpleNamespace(is_set=lambda: True))
    assert start() == STOP, "SIGTERM ends the worker"

    ran = []
    boom = SimpleNamespace(tick=lambda: 1 / 0)
    after = SimpleNamespace(tick=lambda: ran.append("after"))
    seat = SimpleNamespace(root=record.root, env=record.env)
    worker.run_checks(seat, SimpleNamespace(pump=lambda: ran.append("pump")), [boom, after])
    assert ran == ["pump", "after"], "one failing check does not stop the ones after it"

    sent = []
    printed = record.root / "printed"
    printed.write_bytes(b"ready")
    asked = SimpleNamespace(printed=printed, printed_tail=lambda size: b"ready", consent=lambda early: b"", opening=lambda early: "go",
                            CONFIRM_AFTER=0.0, send=lambda text, now: sent.append(text))
    late = worker.Confirm(asked)
    late.started -= worker.STARTUP + 1
    late.tick()
    assert sent == [], "the start-up confirm is not typed once its time is up"
    timely = worker.Confirm(asked)
    timely.tick()
    timely.tick()
    assert sent == ["go"], "within its time the start-up confirm is typed once"
