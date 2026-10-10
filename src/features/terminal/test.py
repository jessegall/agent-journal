import time


import os

from controllers.types import Agents
from runner.hooks import handle
from features.terminal.log import COMMANDS, JOURNAL, MOST_LINES, lines
from providers import PROVIDERS
from tests.conftest import fresh, refused
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


def test_a_command_from_the_terminal_view_is_typed_into_the_agents_terminal_as_a_shell_command(monkeypatch, tmp_path):
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
    import os
    import pty
    import threading
    from types import SimpleNamespace
    import agents.screen as screen
    from engine import runtime
    root = tmp_path / ".journal"
    shown = runtime.session_file(root, "claude-3", screen.SCREEN)
    shown.parent.mkdir(parents=True)
    shown.write_bytes(b"hello from the agent")
    master, slave = pty.openpty()
    out_read, out_write = os.pipe()
    monkeypatch.setattr(screen.sys, "stdin", SimpleNamespace(fileno=lambda: slave))
    monkeypatch.setattr(screen.sys, "stdout", SimpleNamespace(fileno=lambda: out_write))
    typed = []
    monkeypatch.setattr(screen.typist, "send", lambda root, session, keys: typed.append(keys) or True)
    assert "no session ghost" in screen.attach(root, "ghost"), "a session that never printed cannot be attached to"
    threading.Timer(0.3, lambda: os.write(master, b"ls")).start()
    threading.Timer(0.8, lambda: os.write(master, screen.DETACH)).start()
    left = screen.attach(root, "claude-3")
    assert os.read(out_read, 4096) == b"hello from the agent", "what the agent printed is shown on arrival"
    assert typed and typed[0].startswith(b"ls"), "keys typed while attached reach the agent"
    assert "left session claude-3" in left, "the detach key leaves the session running"


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
    worker.run_services(seat, SimpleNamespace(tick=lambda: 1 / 0))
    worker.run_services(seat, SimpleNamespace(tick=lambda: ran.append("services")))
    assert ran[-1] == "services", "a services tick that throws is reported and never ends the worker, and so the tunnel with it"

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

    pressed = []
    asking = SimpleNamespace(printed=printed, printed_tail=lambda size: b"ready", consent=lambda early: b"y", opening=lambda early: "", press_raw=pressed.append, CONFIRM_AFTER=0.0)
    consenting = worker.Confirm(asking)
    consenting.tick()
    assert pressed == [], "a consent question is not answered again within a moment of the start"
    consenting.consented -= worker.CONSENT_EVERY + 1
    consenting.tick()
    assert pressed == [b"y"], "a consent question the agent puts at start-up is answered"

    waiting = threading.Event()
    viewer_thread = threading.Thread(target=waiting.wait, daemon=True)
    viewer_thread.start()
    assert worker.keep_viewer(record.root, Path(record.root).parent, viewer_thread, []) is viewer_thread, "a viewer that is still running is left alone"
    waiting.set()
    monkeypatch.setattr(worker.features, "load", lambda: 1 / 0)
    assert worker.checks(SimpleNamespace(root=record.root, env=record.env), asked) == [], "checks that cannot start leave the worker running without them"
    monkeypatch.undo()

    monkeypatch.setattr(worker, "watch_change_log", lambda: None)
    monkeypatch.setattr(worker, "TICK", 0.01)
    monkeypatch.setattr(worker, "CHECKS_EVERY", 0.0)
    monkeypatch.setattr(worker, "RELOAD_EVERY", 0.0)
    monkeypatch.setattr(worker, "own_build", lambda root: True)
    monkeypatch.setattr(worker, "supervise", lambda root, stopping: stopping.wait(10))
    monkeypatch.setattr(worker, "run_services", lambda seat, services: None)
    sessions.write("claude-1", environment=record.env)
    crashes = []
    monkeypatch.setattr(worker, "keep_viewer", lambda root, cwd, watching, exits: exits.extend([1] * worker.SERVER_CRASHES) or crashes.append(1))
    from supervisor import HEAL
    assert start() == HEAL and crashes, "a server that keeps crashing at start asks the supervisor to heal the build"
    monkeypatch.setattr(worker, "keep_viewer", lambda root, cwd, watching, exits: None)
    built, stamps = [], iter(["a", "a", "a", "b", "b", "b", "b", "b"])
    monkeypatch.setattr(worker, "checks", lambda seat, driver: built.append(1) or [])
    monkeypatch.setattr(worker, "installed_stamp", lambda root: next(stamps))
    assert start() == RELOAD and len(built) >= 2, "checks that could not start are tried again, and a newly installed build reloads the worker"


def fake_engine(monkeypatch, state="idle"):
    from providers import DRIVERS
    from runner import engine as engine_module
    from runner.engine import Engine

    class Fake(DRIVERS["claude"]):
        calls: list

        def stop_turn(self): self.calls.append("stop_turn")
        def interrupt(self): self.calls.append("interrupt")
        def clear_input(self): self.calls.append("clear_input")
        def permit(self, allow): self.calls.append(f"permit {allow}")
        def move_to_background(self): return self.calls.append("background") or True
        def press(self, keys): return self.calls.append(f"press {keys}") or True
        def send(self, text="", groups=None, yielding="", now=False, by="journal"): return self.calls.append(f"send {text}") or True
        def at_prompt(self): return True

    record = fresh()
    report(record, state, "Stop" if state == "idle" else "PreToolUse")
    driver = Fake(record, "claude-1")
    driver.calls = []
    engine = Engine(record, driver)
    monkeypatch.setattr(engine_module.time, "sleep", lambda seconds: None)
    engine.fake_state = "busy" if state == "working" else state
    monkeypatch.setattr(engine.agent, "state", lambda: engine.fake_state)
    return engine, driver.calls


def test_the_engine_pauses_permits_forces_holds_for_typing_and_delivers_only_what_is_fresh(monkeypatch):
    import os
    from engine import inputs
    from runner import engine as engine_module
    engine, calls = fake_engine(monkeypatch, "working")
    root = engine.record.root
    inputs.queue(root, "claude-1", (), "Allow", action=inputs.PERMIT, value="allow")
    assert (engine.permitted(), calls) == ("permission: allow", ["permit True"]), "y for allow"
    inputs.queue(root, "claude-1", (), "Deny", action=inputs.PERMIT, value="deny")
    engine.permitted()
    assert calls[-1] == "permit False", "Esc for deny"
    assert engine.permitted() == ""
    old = inputs.queue(root, "claude-1", (), "Allow", action=inputs.PERMIT, value="allow")
    now = time.time
    monkeypatch.setattr(inputs.time, "time", lambda: old.at + inputs.STALE + 1)
    assert (engine.permitted(), list(inputs.runtime.inputs(root).glob("*.json"))) == ("", []), "an answer left waiting too long is dropped, never typed late"
    monkeypatch.setattr(inputs.time, "time", now)

    calls.clear()
    inputs.queue(root, "claude-1", (), "Pause", action=inputs.PAUSE)
    assert (engine.pausing(), engine.paused, calls) == ("Paused", True, ["stop_turn"]), "pausing stops the turn once"
    engine.held_at = time.time() - 10
    assert engine.pausing() == "Interrupted: the agent is paused" and calls.count("stop_turn") == 2, "a paused agent that starts working is stopped again"
    inputs.queue(root, "claude-1", (), "Resume", action=inputs.RESUME)
    assert (engine.pausing(), engine.paused, calls[-1]) == ("resumed", False, f"send {engine_module.RESUMED}"), "resuming tells the agent to carry on"
    assert engine.pausing() == ""
    inputs.queue(root, "claude-1", (), "Pause", action=inputs.PAUSE, value=inputs.UPDATE)
    assert (engine.pausing(), engine.paused, f"send {engine_module.PAUSED_FOR_UPDATE}" in calls) == ("Paused", True, True), "an agent paused for the update is told so"
    inputs.queue(root, "claude-1", (), "Resume", action=inputs.RESUME, value=inputs.UPDATE)
    assert (engine.pausing(), engine.paused, calls[-1]) == ("resumed", False, f"send {engine_module.RESUMED_AFTER_UPDATE}"), "and is told when it may go on"

    calls.clear()
    inputs.queue(root, "claude-1", (), "Force through", action=inputs.FORCE)
    inputs.queue(root, "claude-1", ("2",), "Effort high", action="effort")
    assert engine.forced() == "controlled: Effort high", "force stops the turn, then types the queued keys"
    assert calls == ["stop_turn", "press ('2',)", f"send {engine_module.CARRY_ON}"], "and tells the agent to carry on afterwards"
    inputs.queue(root, "claude-1", (), "Force through", action=inputs.FORCE)
    assert engine.forced().startswith("forced: stopped the turn, nothing was waiting")

    calls.clear()
    inputs.queue(root, "claude-1", (), "Move to the background", action=inputs.BACKGROUND)
    assert (engine.backgrounded(), calls) == ("moved the running command to the background", ["background"])
    assert engine.backgrounded() == ""

    calls.clear()
    typed = engine.agent.driver.typed
    typed.parent.mkdir(parents=True, exist_ok=True)
    typed.write_text("x")
    assert engine.typing().startswith("holding"), "nothing is typed while the user types in the terminal"
    os.utime(typed, (time.time() - 60,) * 2)
    assert (engine.typing(), calls, typed.exists()) == ("", ["clear_input"], False), "the stale draft is cleared once"
    import providers.drivers as drivers
    from providers import DRIVERS
    monkeypatch.setattr(drivers, "ENTER_AFTER", 0)
    record = fresh()
    read, write = os.pipe()
    claude = DRIVERS["claude"](record, "claude-5", fd=write)
    assert claude.press_raw(b"\x1b[B\r") is None and claude.press_raw(b"\r") is None, "raw keys are written, the enter after them in a write of its own"
    claude.stop_turn()
    claude.interrupt()
    claude.permit(True)
    claude.permit(False)
    sent = os.read(read, 4096)
    assert sent == b"\x1b[B\r\r\x1b\x03" + claude.ALLOW + claude.DENY, "stop, interrupt and the answer to a permission are written to the terminal as keys"
    assert claude.move_to_background() is bool(claude.MOVE_TO_BACKGROUND), "a driver moves a run to the background only when its agent has a key for it"
    os.close(read)
    assert claude._wrote(b"x") is False and claude.fd == -1, "a terminal that is closed stops being written to"
    sent_lines = []
    monkeypatch.setattr(DRIVERS["claude"], "_typed", lambda self, line, confirmed: sent_lines.append(line) or line != "refused")
    keyed_read, keyed_write = os.pipe()
    keyed = DRIVERS["claude"](record, "claude-8", fd=keyed_write)
    assert (keyed.press(("refused", "next")), keyed.press(("first", "", "third")), sent_lines[-1]) == (False, True, "first"), \
        "keys are pressed line by line, and the whole press fails when its first line is not taken"
    assert os.read(keyed_read, 4096) == b"\rthird\r", "each later line is written and entered on its own"
    os.close(keyed_read)
    os.close(keyed_write)
    assert keyed.press(("first", "more")) is False, "a press whose terminal has closed is told so"
    codex_driver = DRIVERS["codex"](record, "codex-8")
    try:
        codex_driver._post("a line", "journal")
        raise AssertionError("a driver without a channel posts nothing")
    except NotImplementedError as why:
        assert "takes no channel" in str(why), "and says so"
    monkeypatch.undo()
    monkeypatch.setattr(drivers, "ENTER_AFTER", 0)
    from pathlib import Path
    from providers.drivers import Driver

    class Plain(Driver):
        name = "plain"

        @classmethod
        def command(cls, args, cwd=None):
            return []

    assert (Driver.latest(Path(".")), Driver.trusted(Path(".")), Driver.consent(b"anything"), Driver.opening(b"anything"), Plain(fresh(), "plain-1").asked()) == ("", None, b"", "", None), \
        "an agent whose driver knows nothing extra has no last conversation, nothing to trust, no question to answer, and no opening line"
    import agents.control as control
    from types import SimpleNamespace
    relaunched = []
    monkeypatch.setattr(control, "online", lambda root, env, session: SimpleNamespace(provider="codex", terminal="term-1"))
    monkeypatch.setattr(control, "relaunch_session", lambda root, env, terminal, session: relaunched.append(terminal))
    monkeypatch.setattr(control, "pressed", lambda root, env, session, label, *more: {"pressed": label})
    assert "has no shell command" in refused(lambda: control.shell(record.root, record.env, "codex-1", "ls")), "a command is not typed into an agent that has no shell line"
    assert "does not support" in refused(lambda: control.choice("nobody", "effort", "high", "m")), "a choice for an agent the journal does not know is refused in words"
    assert (control.relaunch(record.root, record.env, "codex-1"), relaunched, control.move_to_background(record.root, record.env, "codex-1")) == \
        ({"relaunching": True}, ["term-1"], {"pressed": "Move to the background"}), "a relaunch goes to the session's terminal, and the background key is pressed for it"
    mute = DRIVERS["claude"](record, "claude-6")
    assert mute.fd == -1 and mute._wrote(b"x") is False, "a driver with no terminal of its own types through the engine, which finds nobody"

    assert claude.resuming(["--resume", "abc"]) and not claude.resuming(["--model", "x"]), "an agent started on a conversation is told from one started fresh"
    assert claude.conversation(["--resume", "abc", "--model", "x"]) == "abc" and claude.conversation(["--resume", "--model", "x"]) == "", \
        "the conversation is the name that follows the flag, never another flag"
    assert claude.unresumed(["--resume", "abc", "--model", "x"]) == ["--model", "x"], "the flag and its name are taken out of the arguments"
    assert claude.resumed(["--model", "x"], "def")[-2:] == [next(iter(claude.RESUMING)), "def"], "a conversation is resumed with the flag the agent knows"
    assert claude.launch_args(["--model", "x"], automatic=True) == [*claude.AUTO_ARGS, "--model", "x"], "automatic mode adds the flags that approve"
    assert claude.launch_args(list(claude.APPROVAL_FLAGS)[:1], automatic=True) == list(claude.APPROVAL_FLAGS)[:1], "an approval the user chose is not doubled"
    assert claude.skipping(["--model", "x"], True)[:len(claude.SKIP_ARGS)] == list(claude.SKIP_ARGS) and claude.skipping([*claude.SKIP_ARGS, "a"], False) == ["a"], \
        "skipping permissions is added and taken away"
    assert claude.unautomated([*claude.AUTO_ARGS, "a"]) == ["a"] and claude.unautomated(["a"]) == ["a"], "the automatic flags are taken out when present"
    monkeypatch.setenv("PATH", "/nonexistent")
    monkeypatch.setattr(type(claude), "HOMES", ("/nonexistent",))
    assert "was not found on this computer" in refused(lambda: claude.binary("/nonexistent")), "an agent that is not installed is named, with how to put it right"


def test_the_engine_nudges_only_when_idle_and_passes_over_events_from_before_it_was_born(monkeypatch):
    from controllers.types import Agents, Messages, Todos
    from resources.base import SYSTEM
    engine, calls = fake_engine(monkeypatch, "working")
    Messages(engine.record, actor=SYSTEM).create("hello", brief="hi")
    assert engine.nudge() == "busy" and calls == [], "a working agent is never nudged"
    report(engine.record, "idle", "Stop")
    engine.fake_state = "idle"
    engine.agent.driver.reported = (float("-inf"), None)
    assert engine.nudge().startswith("typed: waiting: 1 unread message") and calls[-1].startswith("send waiting:"), "an idle agent is told what waits"
    assert engine.nudge() == "typed, waiting for the hooks", "and not again before its next report"

    Todos(engine.record, actor=SYSTEM).create("old", brief="b")
    engine.born = time.time() + 5
    count = len(engine.agent.pending)
    engine.deliver()
    assert len(engine.agent.pending) == count, "an event older than the engine reaches a fresh cursor as already seen"
    assert engine.idle_without_report() is False

    engine.moved_on()
    assert not Agents(engine.record).by_session("claude-1").data.get("cards"), "a message typed while a command runs makes no card of its own: only a command that was moved has one"
    from engine.command_runs import CommandRun
    running = Agents(engine.record, actor=SYSTEM).by_session("codex-9")
    Agents(engine.record, actor=SYSTEM).update(running.n, provider="codex", commands=[{"command": "npm run build", "tool": "Bash", "at": 5.0}])
    moved = Agents(engine.record, actor=SYSTEM).load(running.n)
    Agents(engine.record, actor=SYSTEM)._moved_to_background(CommandRun(command="npm run build", tool="Bash", at=5.0), moved, state="running")
    Agents(engine.record, actor=SYSTEM)._noted_on_move(Agents(engine.record, actor=SYSTEM).load(running.n), "a message went in")
    cards = Agents(engine.record, actor=SYSTEM).load(running.n).data["cards"]
    assert [(card["label"], card["command"], card["detail"]) for card in cards] == [("Moved a long command to the background", "npm run build", "a message went in")], \
        "the one card for a command moved to the background names the call, whichever provider runs the agent, and what happened beside it is put on that card"
    import features
    from types import SimpleNamespace
    from agents.actors import Agent
    from controllers.types import Agents, Todos, Works
    from engine.event_log import Event
    from resources.base import AGENT, SYSTEM
    from resources.types import BUSY, COMPACTING, IDLE, STOPPED, WORKING
    features.load()
    record = fresh()
    seen = {"alive": True, "report": None, "quiet": 0.0, "sent": []}

    class Driver:
        QUIET = 3.0
        session = "claude-1"
        alive = lambda self: seen["alive"]
        last_report = lambda self: seen["report"]
        quiet_for = lambda self: seen["quiet"]
        ready = lambda self: True
        send = lambda self, line, groups=None, yielding="": seen["sent"].append((line, yielding)) or True

    agent = Agent(record, Driver())
    reporting = lambda status: seen.update(report=SimpleNamespace(status=status, title="claude-1"))
    assert agent.state() == BUSY, "an agent that never reported and just spoke is busy"
    seen["quiet"] = 5.0
    assert agent.state() == IDLE, "one that never reported and has been quiet is idle"
    reporting(STOPPED)
    assert agent.state() == STOPPED, "an agent whose last report said it stopped is stopped"
    reporting(COMPACTING)
    assert agent.state() == COMPACTING, "one that is summarising its conversation says so"
    reporting(IDLE)
    seen["quiet"] = 0.5
    assert agent.state() == BUSY, "an idle report is not believed while the terminal is still moving"
    seen["quiet"] = 2.0
    assert agent.state() == IDLE and agent.is_idle() and not agent.is_working(), "an idle report with a quiet terminal is idle"
    Works(record, actor=AGENT).create("a job")
    reporting("busy")
    assert (agent.state(), agent.is_working()) == (WORKING, True), "an agent busy with work open is working"
    seen["alive"] = False
    assert agent.state() == STOPPED, "an agent whose terminal is gone is stopped whatever it reported"
    seen["alive"] = True
    row = Agents(record, actor=SYSTEM).create("claude-1", status="working")
    agent.mark("idle", "Stop")
    marked = Agents(record, actor=SYSTEM).load(row.n)
    assert (marked.status, marked.event) == ("idle", "Stop"), "marking an agent writes its status and the event behind it"
    todo = Todos(record, actor=AGENT).create("something for the agent")
    agent.notify(next(e for e in record.event_log.events(0, 50) if e.type == "todo" and e.n == todo.n))
    assert agent.flush() == "1 new todo 1", "what is waiting for the agent is sent to it in one line"
    assert len(seen["sent"]) == 1 and agent.pending == [], "and is no longer waiting once it has gone"
    from agents.actors import User, event_data, finished
    assert (finished(record, "nothing:1"), finished(record, "todo:99999"), finished(record, f"todo:{todo.n}")) == (False, False, False), \
        "a row that cannot be found, or is not finished, does not count as finished"
    Todos(record, actor=AGENT).complete(todo.n, "done")
    assert finished(record, f"todo:{todo.n}") is True, "a finished row does"
    assert event_data(record, Event(2, 0.0, "nudge", 99999, "created", AGENT)) == {}, "an event of a line that is gone carries no data"
    assert (event_data(record, Event(1, 0.0, "todo", todo.n, "created", AGENT)), User(record).unread()) == ({}, []), \
        "an event of a row that is not told by its title carries no data, and nothing unread waits for you"


def test_a_worker_that_keeps_failing_with_no_earlier_build_is_retried_slower_then_the_session_ends(monkeypatch):
    import os
    import time
    import supervisor

    read, write = os.pipe()
    ours = object.__new__(supervisor.Supervisor)
    ours.cwd, ours.stdout, ours.heal_command, ours.unhealed, ours.worker, ours.worker_due = os.getcwd(), write, ["true"], 0, None, 0.0
    ours.stop_agent = lambda: 99
    delays = []
    for _ in range(supervisor.UNHEALED_LIMIT - 1):
        ours.worker_began = time.time()
        assert ours.after_worker(1) is None
        delays.append(ours.worker_due - time.time())
    assert all(later > earlier for earlier, later in zip(delays, delays[1:])) and delays[0] > 1, "each retry waits longer than the one before"
    ours.worker_began = time.time()
    assert ours.after_worker(1) == 99, "after the cap the session ends instead of restarting the worker again"
    os.close(write)
    said = os.read(read, 4096).decode()
    assert said.count("no earlier build to go back to") == 1, "one plain line says why"
    ours.worker_began = time.time() - supervisor.QUICK - 1
    ours.unhealed = 3
    assert ours.after_worker(supervisor.RELOAD) is None and ours.unhealed == 0, "a worker that ran on resets the count"


def test_long_typed_text_arrives_whole_a_full_queue_is_reported_and_another_users_folder_is_stepped_around(tmp_path, monkeypatch):
    import threading
    from engine import typist
    from supervisor import Supervisor
    root = tmp_path / ".journal"
    root.mkdir()
    inbox = typist.listen(root, "claude-1")
    raw = bytes(range(256)) * 4096
    got, done = [], threading.Event()

    def drain():
        while not done.is_set():
            got.extend(typist.receive(inbox))
            time.sleep(0.001)
    reading = threading.Thread(target=drain)
    reading.start()
    sent = typist.send(root, "claude-1", raw)
    time.sleep(0.3)
    done.set()
    reading.join()
    got.extend(typist.receive(inbox))
    assert (bool(sent), b"".join(got) == raw) == (True, True), "a megabyte typed at once arrives whole and in order"
    typist.close(inbox, root, "claude-1")
    stalled = typist.listen(root, "claude-2")
    monkeypatch.setattr(typist, "FULL_FOR", 0.3)
    assert typist.send(root, "claude-2", raw) is False, "with nobody reading, the sender is told the text did not all go"
    here = typist.folder(root)
    monkeypatch.setattr(typist.os, "getuid", lambda: os.stat(here).st_uid + 1)
    elsewhere = typist.folder(root)
    assert elsewhere != here and elsewhere.name.startswith(here.name), "a folder another user owns is not shared: this user gets a folder of their own"
    seat = object.__new__(Supervisor)
    seat.root, seat.session = root, "claude-2"
    assert seat.socket_path().parent == elsewhere, "the supervisor and the sender agree on which folder"
    stalled.close()


def test_an_agent_silent_for_two_minutes_is_probed_and_then_marked_idle_or_stopped_by_what_comes_back(monkeypatch):
    from runner import engine as engine_module
    engine, calls = fake_engine(monkeypatch, "working")
    driver = engine.agent.driver
    marks = []
    monkeypatch.setattr(driver, "alive", lambda: False)
    assert engine.probe() == "", "an agent whose terminal is gone is not probed"
    monkeypatch.setattr(driver, "alive", lambda: True)
    monkeypatch.setattr(driver, "quiet_for", lambda: 0)
    monkeypatch.setattr(driver, "asking", lambda: False)
    monkeypatch.setattr(engine.agent, "mark", lambda state, why: marks.append((state, why)))
    assert engine.probe() == "", "an agent that has been heard from lately is left alone"
    monkeypatch.setattr(driver, "quiet_for", lambda: engine_module.SILENT_AFTER)
    engine.typed_at = 0.0
    silent_at = driver.last_report().at + engine_module.SILENT_AFTER + 1
    monkeypatch.setattr(engine_module.time, "time", lambda: silent_at)
    assert engine.probe() == "silent for two minutes: probing with Ctrl-C" and "interrupt" in calls, "a silent working agent is interrupted once to see whether it answers"
    assert engine.probe() == "probed, waiting", "the probe waits for an answer"
    now = engine_module.time.time()
    monkeypatch.setattr(engine_module.time, "time", lambda: now + engine_module.PROBE_WAIT + 1)
    assert engine.probe() == "probe: at the prompt, idle" and marks[-1][0] == engine_module.IDLE, "an agent back at its prompt is idle"
    monkeypatch.setattr(driver, "at_prompt", lambda: False)
    assert engine.probe() == "probe: nothing came back, stopped" and marks[-1][0] == engine_module.STOPPED, "an agent that stays silent and away from its prompt is stopped"
    monkeypatch.setattr(driver, "quiet_for", lambda: 0)
    assert engine.probe() == "probe: working" and engine.probed_at == 0.0, "an agent that printed something in the meantime is working"


def test_the_supervisor_stops_a_stubborn_agent_relays_what_the_user_types_and_reports_a_failed_command(tmp_path, monkeypatch):
    import collections
    import os
    import socket
    import subprocess
    import supervisor
    from supervisor import Adopted, Supervisor

    assert (supervisor.as_bytes("ff00"), supervisor.as_bytes(b"\x01")) == (b"\xff\x00", b"\x01"), "saved terminal settings come back as bytes"
    adopted = Adopted.from_json({"pid": 4, "fd": 5, "session": "claude-4", "saved": [1, 2, 3, 4, 5, 6, ["00", "01"]]})
    assert (adopted.saved[6], Adopted.from_json({"pid": 4, "fd": 5, "session": "s", "saved": None}).saved) == ([b"\x00", b"\x01"], None), \
        "an adopted terminal keeps its saved settings, or none"

    ignoring = subprocess.Popen(["python3", "-c", "import signal,time\nsignal.signal(signal.SIGHUP, signal.SIG_IGN)\nsignal.signal(signal.SIGTERM, signal.SIG_IGN)\nprint('up', flush=True)\ntime.sleep(60)"],
                                stdout=subprocess.PIPE)
    ignoring.stdout.readline()
    assert supervisor.stop(ignoring.pid, grace=0.3) != 0, "an agent that ignores hangup and terminate is killed in the end"
    assert supervisor.stop(ignoring.pid, grace=0.1) == 0, "an agent that is already gone is not an error"

    seat = object.__new__(Supervisor)
    reader, writer = socket.socketpair(socket.AF_UNIX, socket.SOCK_DGRAM)
    reader.setblocking(False)
    seat.inbox = reader
    assert seat.received() == [], "an empty inbox gives nothing"
    writer.send(b"typed one")
    writer.send(b"typed two")
    assert seat.received() == [b"typed one", b"typed two"], "everything waiting in the inbox is read at once"

    inward, outward = os.pipe()
    seat.fd, seat.pending = outward, collections.deque([b"a" * 1_000_000, b"tail"])
    seat.feed()
    assert 0 < len(seat.pending[0]) < 1_000_000, "a full terminal takes what it can and the rest waits"
    os.close(inward)
    seat.feed()
    assert list(seat.pending) == [b"tail"], "a terminal that is gone drops what was waiting for it"
    os.close(outward)

    seat.folder, seat.typed_at = tmp_path, 0.0
    seat.typing(b"hello")
    assert (tmp_path / supervisor.TYPED).exists(), "typing in the terminal leaves a mark that the user is typing"
    seat.typing(b"\r")
    assert not (tmp_path / supervisor.TYPED).exists(), "pressing enter clears the mark"

    seat.cwd, seat.stdout = tmp_path, os.open(tmp_path / "shown", os.O_CREAT | os.O_WRONLY)
    assert seat.delegate(["python3", "-c", "import sys; sys.stderr.write('boom'); sys.exit(3)"]) == "", "a command that fails returns no output"
    assert "failed: boom" in (tmp_path / "shown").read_text(), "and says in the terminal why"
    ignoring.wait()
    reader.close()
    writer.close()

    import json
    import signal
    import sys
    import tty
    master, follower = os.openpty()
    tty.setraw(follower)
    sleeper = subprocess.Popen(["python3", "-c", "import time; time.sleep(30)"])
    monkeypatch.setattr(sys, "stdin", open(os.devnull))
    monkeypatch.setattr(sys, "stdout", open(tmp_path / "terminal", "w"))
    handled = []
    monkeypatch.setattr(supervisor.signal, "signal", lambda sent, then: handled.append(sent))
    root = tmp_path / ".journal"
    held = Supervisor(supervisor.Launch.from_json({
        "root": str(root), "cwd": str(tmp_path), "env": "main", "agent": "claude", "worker": [sys.executable, "-c", f"import sys; sys.exit({supervisor.STOP})"],
        "heal": ["true"], "ended": ["true"], "args": ["--resume"], "command": ["claude"], "headless": True,
        "adopt": {"pid": sleeper.pid, "fd": master, "session": "claude-77", "saved": None}}))
    folder = root / "runtime" / "sessions" / "claude-77"
    launched, shape = json.loads((folder / supervisor.LAUNCHED).read_text()), json.loads((folder / supervisor.SCREEN_SHAPE).read_text())
    assert (launched["pid"], launched["args"], shape["rows"], shape["cols"]) == (sleeper.pid, ["--resume"], *supervisor.HEADLESS_SIZE), \
        "an adopted agent is recorded with how it was launched, and a headless terminal gets the fixed size"
    os.write(follower, b"hello from the agent")
    assert held.relay() is None and b"hello from the agent" in (folder / supervisor.PRINTED).read_bytes(), "what the agent prints is relayed and kept"
    sender = socket.socket(socket.AF_UNIX, socket.SOCK_DGRAM)
    sender.sendto(b"from the viewer", str(held.socket_path()))
    sender.close()
    assert held.relay() is None and list(held.pending) == [b"from the viewer"], "a line typed from the viewer waits to be fed to the agent"
    assert held.relay() is None and not held.pending and os.read(follower, 64) == b"from the viewer", "and reaches the agent's terminal"
    assert held.exited() is None, "an agent with no exit command has no polite way out"
    assert held.run() == -signal.SIGHUP and sleeper.wait(5) is not None, "a worker that asks to stop ends the session: the agent is hung up on"
    assert set(handled) == {signal.SIGWINCH, signal.SIGHUP, signal.SIGTERM} and not held.socket_path().exists(), \
        "the session handles resizes and hangups while it runs, and takes its socket away when it ends"
    os.close(follower)

    seat.exit, seat.fd = "bye", os.open(os.devnull, os.O_RDONLY)
    assert seat.exited() is None, "an agent whose terminal is already closed has no farewell to type and is left to be stopped"
    os.close(seat.fd)
    seat.fd, seat.inbox = os.open(os.devnull, os.O_RDONLY), socket.socket(socket.AF_UNIX, socket.SOCK_DGRAM)
    printed = []
    seat.output = printed.append
    from types import SimpleNamespace
    patched = lambda **changes: monkeypatch.setattr(supervisor, "os", SimpleNamespace(**{**vars(os), **changes}))
    chosen = lambda ready, writable: monkeypatch.setattr(supervisor, "select", SimpleNamespace(select=lambda sources, writing, other, wait=None: (ready, writable, [])))
    patched(read=lambda fd, size: (_ for _ in ()).throw(OSError("terminal gone")))
    chosen([seat.fd], [])
    seat.drain()
    assert printed == [], "a terminal that fails while the rest of its output is drained is left alone"
    seat.sources, seat.pid, seat.stdin = [seat.fd], os.getpid(), os.open(os.devnull, os.O_RDONLY)
    patched(read=lambda fd, size: (_ for _ in ()).throw(OSError("terminal gone")), waitpid=lambda pid, flags: (pid, 7 << 8))
    assert seat.relay() == 7 << 8, "an agent whose terminal fails while it is read has ended, and its status is the answer"
    chosen([seat.stdin], [seat.fd])
    seat.pending = collections.deque([b"waiting"])
    seat.feed = lambda: seat.pending.clear()
    patched(read=lambda fd, size: b"")
    seat.stop_agent = lambda: 99
    assert seat.relay() == 99 and not seat.pending, "a terminal that closes ends the agent, after what was waiting to be typed is sent"
    patched(read=lambda fd, size: b"more")
    seat.typing = lambda data: printed.append(data)
    assert seat.relay() is None and list(seat.pending) == [b"more"] and printed == [b"more"], "what is typed in the terminal is queued for the agent"
    monkeypatch.undo()
    os.close(seat.fd)
    os.close(seat.stdin)
    seat.inbox.close()

    seat.stdout, seat.ended_command, seat.cwd = os.open(tmp_path / "shown", os.O_WRONLY | os.O_APPEND), ["journal", "ended", "claude-1"], tmp_path / "nowhere"
    seat.start_ended()
    assert "did not start" in (tmp_path / "shown").read_text(), "a cleanup that cannot start is said in the terminal"
    seat.heal_command, seat.cwd, seat.unhealed, seat.worker_began = ["python3", "-c", "pass"], tmp_path, supervisor.UNHEALED_LIMIT - 1, time.time()
    seat.stop_agent = lambda: 77
    assert seat.after_worker(1) == 77 and "no earlier build" in (tmp_path / "shown").read_text(), "a build that keeps failing to start ends the session, and the terminal says why"


