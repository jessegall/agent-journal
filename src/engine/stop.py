import time
from pathlib import Path
from engine.stored import write_text

WAIT = 15.0
EVERY = 0.2


def flag(root: Path) -> Path:
    return Path(root) / "runtime" / "stop"


def at(root: Path) -> float:
    try:
        return float(flag(root).read_text().strip() or 0)
    except (OSError, ValueError):
        return 0.0


def asked(root: Path, since: float = 0.0) -> bool:
    return at(root) > since


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
