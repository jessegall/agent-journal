import sys
import tempfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
import os  # noqa: E402
import threading  # noqa: E402
import time  # noqa: E402
from engine import drivers, supervisor, terminal  # noqa: E402
from tests.kit import check, done  # noqa: E402

root = Path(tempfile.mkdtemp())
package = root / "src"
package.mkdir()
(package / "one.py").write_text("one\n")
(package / "ignored.js").write_text("one\n")
before = terminal.watched(root)
(package / "ignored.js").write_text("two\n")
check("the owner watches installed Python only", terminal.watched(root), before)
(root / "plugins" / "workflows" / "vendor").mkdir(parents=True)
(root / "plugins" / "workflows" / "vendor" / "tool.py").write_text("plugin\n")
check("a plugin's Python outside the package is never watched", terminal.watched(root), before)
(package / "two.py").write_text("two\n")
check("a Python package change asks for a fresh supervisor", terminal.watched(root) != before, True)

calls = []
original = terminal.subprocess.Popen
terminal.subprocess.Popen = lambda command, **options: calls.append((command, options)) or "process"
made = terminal.spawn_supervisor(root, Path("/tmp/project"), "main", "codex", 17, "codex-9", 21)
terminal.spawn_supervisor(root, Path("/tmp/project"), "main", "codex", 17, "codex-9")
terminal.subprocess.Popen = original
command, options = calls[0]
check("the replaceable supervisor receives the live PTY, the session and the owner's lifeline", (made, command[-7:], options["pass_fds"]),
      ("process", [str(root), "/tmp/project", "main", "codex", "17", "codex-9", "21"], (17, 21)))
check("without a lifeline only the PTY is passed", calls[1][1]["pass_fds"], (17,))

read, write = terminal.lifeline()
check("the lifeline's read end is inherited and its write end is not", (os.get_inheritable(read), os.get_inheritable(write)), (True, False))
os.close(write)
check("closing the write end leaves the read end at an end", os.read(read, 1), b"")
os.close(read)
check("the supervisor runs as a separate Python process", (command[0], Path(command[1]).name), (sys.executable, "supervisor.py"))
check("reload and stop use process exit codes", (terminal.RELOAD, terminal.STOP), (75, 76))

# THE SUPERVISOR KEEPS THE VIEWER UP: it starts one that no longer answers, off the relay loop
started = []
original_start = supervisor.viewer.start
supervisor.viewer.start = lambda root, project: started.append((root, project)) or time.sleep(0.2) or "http://127.0.0.1:8424/"
watching = supervisor.keep_viewer(root, Path("/tmp/project"), None)
again = supervisor.keep_viewer(root, Path("/tmp/project"), watching)
check("while one check is still running, no second one is started", again is watching, True)
watching.join(timeout=5)
supervisor.viewer.start = original_start
check("a viewer that stopped answering is started again, in its own thread", (started, watching.is_alive()), ([(root, Path("/tmp/project"))], False))


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
result = terminal.run(root, Path("/tmp/project"), "main", "fake", [])
terminal.spawn_agent, terminal.spawn_supervisor, terminal.child, terminal.termios.tcgetattr, terminal.os.write, terminal.os.close = originals[:6]
del terminal.print
if originals[6] is None:
    drivers.DRIVERS.pop("fake")
else:
    drivers.DRIVERS["fake"] = originals[6]
check("a reload keeps the agent session and PTY while replacing its supervisor", (result, [(fd, session) for fd, session, _ in launched]), (0, [(17, "fake-41"), (17, "fake-41")]))
check("and every supervisor holds the same lifeline, so services live across a reload", len({line for _, _, line in launched}), 1)

# LAUNCHING SEATS THE SESSION so the environment is chosen and taken before the agent says anything
from engine.sessions import Sessions  # noqa: E402
seated = Sessions(root).read("fake-41")
check("the session is bound to the environment it was launched on, with its provider and pid", (seated.get("environment"), seated.get("provider"), seated.get("pid")), ("main", "fake", 41))
check("and the agent is handed that environment, so its hooks prefer it", terminal.agent_environment({"PATH": "/bin"}, "main").get("JOURNAL_ENV"), "main")

# WHAT THE TERMINAL SENDS is only typing when a character comes with it
from engine.supervisor import typing  # noqa: E402
check("letters, a paste and a backspace are typing", [typing(b) for b in (b"h", b"\x1b[200~hi\x1b[201~", b"\x7f")], [True, True, True])
check("clicking away to the browser is not typing, nor is any other sequence the terminal reports",
      [typing(b) for b in (b"\x1b[O", b"\x1b[I", b"\x1b[<35;40;12M", b"\x1b[A", b"\x1bOA", b"\x1b[24;80R", b"\x1b[200~\x1b[201~")],
      [False] * 7)

done()
