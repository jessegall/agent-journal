import sys
import tempfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from engine import drivers, terminal  # noqa: E402
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
made = terminal.spawn_supervisor(root, Path("/tmp/project"), "main", "codex", 17, "codex-9")
terminal.subprocess.Popen = original
command, options = calls[0]
check("the replaceable supervisor receives the live PTY and session", (made, command[-6:], options["pass_fds"]),
      ("process", [str(root), "/tmp/project", "main", "codex", "17", "codex-9"], (17,)))
check("the supervisor runs as a separate Python process", (command[0], Path(command[1]).name), (sys.executable, "supervisor.py"))
check("reload and stop use process exit codes", (terminal.RELOAD, terminal.STOP), (75, 76))


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
terminal.spawn_agent = lambda command, cwd: (41, 17)
terminal.spawn_supervisor = lambda root, cwd, env, agent, fd, session: launched.append((fd, session)) or Coordinator(next(codes))
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
check("a reload keeps the agent session and PTY while replacing its supervisor", (result, launched), (0, [(17, "fake-41"), (17, "fake-41")]))

done()
