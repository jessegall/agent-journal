import time

import surfaces.control
from tests.conftest import fresh
from tests.kit import nudges, report, tick


def test_a_command_holding_the_terminal_too_long_is_moved_to_the_background(monkeypatch):
    record = fresh()
    moved = []
    monkeypatch.setattr(surfaces.control, "move_to_background", lambda root, env, session: moved.append(session) or {"queued": True})
    started = time.time() - 180
    report(record, "working", "PreToolUse", provider="claude", commands=[{"what": "npm test", "tool": "Bash", "at": started}])
    tick(record)
    tick(record)
    assert (moved, [n for n in nudges(record) if "moved to the background" in n]) == \
        (["claude-1"], ["your command ran 3 min in the foreground and was moved to the background"]), \
        "moved once, and the agent is told"
