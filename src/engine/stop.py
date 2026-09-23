import time
from pathlib import Path
from engine import runtime
from engine.stored import write_text

WAIT = 15.0
EVERY = 0.2


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
    from engine.viewer import running
    end = time.monotonic() + seconds
    while time.monotonic() < end:
        if not running(Path(root)):
            return True
        time.sleep(EVERY)
    return False
