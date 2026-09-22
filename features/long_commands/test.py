import time

import surfaces.control
from tests.conftest import fresh
from tests.kit import nudges, report, tick


def test_a_command_holding_the_terminal_too_long_is_moved_to_the_background(monkeypatch):
    record = fresh()
    moved = []
    monkeypatch.setattr(surfaces.control, "move_to_background", lambda root, env, session: moved.append(session) or {"queued": True})
    started = time.time() - 45
    report(record, "working", "PreToolUse", provider="claude", commands=[{"what": "npm test", "tool": "Bash", "at": started}])
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
    report(record, "working", "PreToolUse", session="conversation-1", provider="claude", commands=[{"what": "sleep 40", "tool": "Bash", "at": time.time() - 31}])
    engine = Engine(record, DRIVERS["claude"](record, "claude-99"))
    engine.agent.driver.last_report = lambda: SimpleNamespace(title="conversation-1")
    engine.clock()
    assert moved, "the launcher's seat is claude-99, the hooks report on conversation-1: the clock ticks for the one with the command"
