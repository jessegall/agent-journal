import os
import sys
import time
from pathlib import Path

from engine import drivers, supervisor, terminal


def test_the_owner_watches_only_installed_python_and_asks_for_a_fresh_supervisor_on_change(tmp_path):
    root = tmp_path
    package = root / "src"
    package.mkdir()
    (package / "one.py").write_text("one\n")
    (package / "ignored.js").write_text("one\n")
    before = terminal.watched(root)
    (package / "ignored.js").write_text("two\n")
    assert terminal.watched(root) == before, "the owner watches installed Python only"
    (root / "plugins" / "workflows" / "vendor").mkdir(parents=True)
    (root / "plugins" / "workflows" / "vendor" / "tool.py").write_text("plugin\n")
    assert terminal.watched(root) == before, "a plugin's Python outside the package is never watched"
    (package / "two.py").write_text("two\n")
    assert (terminal.watched(root) != before) is True, "a Python package change asks for a fresh supervisor"


def test_spawn_supervisor_passes_the_pty_the_session_and_the_owners_lifeline(tmp_path):
    root = tmp_path
    calls = []
    original = terminal.subprocess.Popen
    terminal.subprocess.Popen = lambda command, **options: calls.append((command, options)) or "process"
    try:
        made = terminal.spawn_supervisor(root, Path("/tmp/project"), "main", "codex", 17, "codex-9", 21)
        terminal.spawn_supervisor(root, Path("/tmp/project"), "main", "codex", 17, "codex-9")
    finally:
        terminal.subprocess.Popen = original
    command, options = calls[0]
    assert (made, command[-7:], options["pass_fds"]) == \
        ("process", [str(root), "/tmp/project", "main", "codex", "17", "codex-9", "21"], (17, 21)), \
        "the replaceable supervisor receives the live PTY, the session and the owner's lifeline"
    assert calls[1][1]["pass_fds"] == (17,), "without a lifeline only the PTY is passed"

    read, write = terminal.lifeline()
    assert (os.get_inheritable(read), os.get_inheritable(write)) == (True, False), \
        "the lifeline's read end is inherited and its write end is not"
    os.close(write)
    assert os.read(read, 1) == b"", "closing the write end leaves the read end at an end"
    os.close(read)
    assert (command[0], Path(command[1]).name) == (sys.executable, "supervisor.py"), "the supervisor runs as a separate Python process"
    assert (terminal.RELOAD, terminal.STOP) == (75, 76), "reload and stop use process exit codes"


def test_the_supervisor_keeps_the_viewer_up_off_the_relay_loop(tmp_path):
    root = tmp_path
    started = []
    original_start = supervisor.viewer.start
    supervisor.viewer.start = lambda root, project: started.append((root, project)) or time.sleep(0.2) or "http://127.0.0.1:8424/"
    try:
        watching = supervisor.keep_viewer(root, Path("/tmp/project"), None)
        again = supervisor.keep_viewer(root, Path("/tmp/project"), watching)
        assert (again is watching) is True, "while one check is still running, no second one is started"
        watching.join(timeout=5)
    finally:
        supervisor.viewer.start = original_start
    assert (started, watching.is_alive()) == ([(root, Path("/tmp/project"))], False), \
        "a viewer that stopped answering is started again, in its own thread"


class FakeDriver(drivers.Driver):
    def command(self, args):
        return ["fake", *args]


class Coordinator:
    def __init__(self, code):
        self.code = code

    def wait(self):
        return self.code

    def poll(self):
        return self.code


def no_terminal(_):
    raise terminal.termios.error


def test_a_reload_keeps_the_agent_session_and_pty_while_replacing_its_supervisor(tmp_path, monkeypatch):
    monkeypatch.setattr(sys, "stdin", open(os.devnull))
    root = tmp_path
    launched = []
    codes = iter((terminal.RELOAD, 0))
    children = iter(((0, 0), (41, 0)))
    originals = (terminal.spawn_agent, terminal.spawn_supervisor, terminal.child, terminal.termios.tcgetattr,
                 terminal.os.write, terminal.os.close, drivers.DRIVERS.get("fake"))
    terminal.spawn_agent = lambda command, cwd, env='': (41, 17)
    terminal.spawn_supervisor = lambda root, cwd, env, agent, fd, session, lifeline=-1: launched.append((fd, session, lifeline)) or Coordinator(next(codes))
    terminal.child = lambda pid, block=False: next(children)
    terminal.termios.tcgetattr = no_terminal
    terminal.os.write = lambda fd, data: len(data)
    terminal.os.close = lambda fd: None
    terminal.print = lambda *args, **kwargs: None
    drivers.DRIVERS["fake"] = FakeDriver
    try:
        result = terminal.run(root, Path("/tmp/project"), "main", "fake", [])
    finally:
        terminal.spawn_agent, terminal.spawn_supervisor, terminal.child, terminal.termios.tcgetattr, terminal.os.write, terminal.os.close = originals[:6]
        del terminal.print
        if originals[6] is None:
            drivers.DRIVERS.pop("fake")
        else:
            drivers.DRIVERS["fake"] = originals[6]
    assert (result, [(fd, session) for fd, session, _ in launched]) == (0, [(17, "fake-41"), (17, "fake-41")]), \
        "a reload keeps the agent session and PTY while replacing its supervisor"
    assert len({line for _, _, line in launched}) == 1, "and every supervisor holds the same lifeline, so services live across a reload"

    from engine.sessions import Sessions
    seated = Sessions(root).read("fake-41")
    assert (seated.get("environment"), seated.get("provider"), seated.get("pid")) == ("main", "fake", 41), \
        "the session is bound to the environment it was launched on, with its provider and pid"
    assert terminal.agent_environment({"PATH": "/bin"}, "main").get("JOURNAL_ENV") == "main", \
        "and the agent is handed that environment, so its hooks prefer it"


def test_what_the_terminal_sends_is_only_typing_when_a_character_comes_with_it():
    from engine.supervisor import typing
    assert [typing(b) for b in (b"h", b"\x1b[200~hi\x1b[201~", b"\x7f")] == [True, True, True], \
        "letters, a paste and a backspace are typing"
    assert [typing(b) for b in (b"\x1b[O", b"\x1b[I", b"\x1b[<35;40;12M", b"\x1b[A", b"\x1bOA", b"\x1b[24;80R", b"\x1b[200~\x1b[201~")] == [False] * 7, \
        "clicking away to the browser is not typing, nor is any other sequence the terminal reports"
