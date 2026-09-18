import fcntl
import json
import os
import pty
import select
import struct
import sys
import tempfile
import termios
import time
from pathlib import Path

HERE = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(HERE))
from controllers.types import Agents, Messages  # noqa: E402
from engine.record import Record  # noqa: E402
from install import install  # noqa: E402
from resources.base import AGENT, SYSTEM, USER  # noqa: E402

ok = fail = 0


def check(label, got, want):
    global ok, fail
    if got == want:
        ok += 1
    else:
        fail += 1
        print(f"  FAIL {label}\n       got  {got!r}\n       want {want!r}")


project = Path(tempfile.mkdtemp()).resolve()
(project / ".claude").mkdir()


def trust(project: Path, on: bool) -> None:        # Claude asks to trust a new folder; the harness answers for the test
    f = Path.home() / ".claude.json"
    got = json.loads(f.read_text()) if f.is_file() else {}
    projects = got.setdefault("projects", {})
    if on:
        projects.setdefault(str(project), {})["hasTrustDialogAccepted"] = True
    else:
        projects.pop(str(project), None)
    f.write_text(json.dumps(got, indent=2))


trust(project, True)
root = project / ".journal"
os.environ["PATH"] = os.environ.get("PATH", "") or os.defpath
print("install:", *install(project))
record = Record(root, "main")
agents = Agents(record, actor=SYSTEM)


def status():
    rows = [r for r in agents.all() if r.data.get("provider") == "claude"]
    return (rows[-1].data.get("status"), rows[-1].data.get("event")) if rows else (None, None)


def wait_for(want_status, seconds):
    end = time.time() + seconds
    while time.time() < end:
        if status()[0] == want_status:
            return True
        time.sleep(0.5)
    return False


pid, fd = pty.fork()
if pid == 0:
    os.chdir(project)
    for k in ("CLAUDECODE", "CLAUDE_CODE_ENTRYPOINT", "CLAUDE_CODE_SESSION_ID"):
        os.environ.pop(k, None)
    os.execvp(sys.executable, [sys.executable, "-c",
              f"import sys; sys.path.insert(0, {str(HERE)!r}); from pathlib import Path; from engine import supervisor; "
              f"supervisor.run(Path({str(root)!r}), Path({str(project)!r}), 'main', 'claude', ['--model', 'haiku', '--dangerously-skip-permissions'])"])
fcntl.ioctl(fd, termios.TIOCSWINSZ, struct.pack("HHHH", 40, 140, 0, 0))
screen = b""


def pump(seconds):
    global screen
    end = time.time() + seconds
    while time.time() < end:
        r, _, _ = select.select([fd], [], [], 0.2)
        if fd in r:
            try:
                chunk = os.read(fd, 65536)
            except OSError:
                return
            screen += chunk


try:
    pump(2)
    started = False
    for _ in range(20):
        pump(1)
        if status()[0] == "idle":
            started = True
            break
    check("the hook wrote idle at the start: the agent row exists and the engine can read it", (started, status()[1] in ("SessionStart", "Stop")), (True, True))
    seats = list((root / "runtime").glob("seat-*.json"))
    check("the engine writes its seat record", bool(seats) and json.loads(seats[0].read_text())["agent"], "claude")

    # A USER EVENT REACHES THE AGENT: the engine types it, Claude submits it, the hooks say working, then idle again
    Messages(record, actor=USER).create("say the single word PONG and nothing else")
    typed = wait_for("working", 10)
    check("the engine typed the event and Claude took it (UserPromptSubmit → working)", typed, True)
    pump(2)
    check("the typed line is on Claude's screen, in the small vocabulary", b"message 1 created" in screen, True)
    back = wait_for("idle", 20)
    check("Claude answered and stopped: idle again", (back, status()[1]), (True, "Stop"))
    seat = json.loads(seats[0].read_text()) if seats else {}
    check("the seat record followed", seat.get("state") in ("idle", "working"), True)
    check("the message counts as seen by the agent only once it acts on it", AGENT in Messages(record).show(1).seen, False)
finally:
    os.kill(pid, 9)
    trust(project, False)
    if fail:
        import re
        print("SCREEN:", re.sub(r"\s+", " ", re.sub(rb"\x1b\[[0-?]*[ -/]*[@-~]|\x1b\][^\x07]*\x07|\x1b[@-Z\\-_]", b"", screen).decode(errors="replace"))[-700:])

print(f"\n{ok} passed, {fail} failed")
sys.exit(1 if fail else 0)
