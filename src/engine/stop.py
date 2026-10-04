import os
import signal
import time
from contextlib import suppress
from pathlib import Path
from engine import runtime
from engine.proc import ran
from engine.sessions import alive
from engine.stored import write_text
from engine.viewer import last, running

WAIT = 15.0
EVERY = 0.2
ESCALATE = 5.0


def flag(root: Path) -> Path:
    return Path(root) / "runtime" / "stop"


def at(root: Path) -> float:
    try:
        text = flag(root).read_text().strip()
        return float(text) if text else 0.0
    except (OSError, ValueError):
        return 0.0


def asked(root: Path, since: float = 0.0) -> bool:
    return at(root) > since


def session_flag(root: Path, terminal: str) -> Path:
    return runtime.session_file(Path(root), terminal, "stop")


def ask_session(root: Path, terminal: str) -> None:
    write_text(session_flag(root, terminal), f"{time.time()}\n")


def ask(root: Path) -> None:
    where = flag(root)
    where.parent.mkdir(parents=True, exist_ok=True)
    write_text(where, f"{time.time()}\n")


def clear(root: Path) -> None:
    flag(root).unlink(missing_ok=True)


def gone(root: Path, seconds: float = WAIT) -> bool:
    server = serving(Path(root))
    end = time.monotonic() + seconds
    while time.monotonic() < end:
        if not (alive(server) if server else running(Path(root))):
            return True
        time.sleep(EVERY)
    return False


def ended(root: Path) -> bool:
    if gone(root):
        return True
    for signal_, seconds in ((signal.SIGTERM, ESCALATE), (signal.SIGKILL, ESCALATE)):
        server = serving(Path(root))
        if not server:
            return not running(Path(root))
        with suppress(OSError):
            os.kill(server, signal_)
        if gone(root, seconds):
            return True
    return False


def serving(root: Path) -> int:
    pid = last(root).pid
    listed = ran(["ps", "-o", "command=", "-p", str(pid)]) if pid else None
    command = listed.stdout if listed else ""
    return pid if " serve" in command and any(form in command for form in (str(root), str(root.resolve()))) else 0
