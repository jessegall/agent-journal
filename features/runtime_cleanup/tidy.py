import shutil
import time
from pathlib import Path

TAILS = {"printed-*": 64 * 1024, "screen-*": 1024 * 1024, "*.log": 1024 * 1024}
SESSIONS = ("printed-*", "screen-*", "typed-*", "trigger-*.json", "gate-*.json", "seat-*.json", "session-*.json", "announced-*.json", "greeted-*")


def tidy(root: Path, days: float) -> dict:
    runtime = Path(root) / "runtime"
    if not runtime.is_dir():
        return {"removed": 0, "trimmed": 0}
    quiet = time.time() - days * 86400
    removed = [f for pattern in SESSIONS for f in runtime.glob(pattern) if f.is_file() and f.stat().st_mtime < quiet]
    for f in removed:
        f.unlink(missing_ok=True)
    ended = [d for d in (runtime / "sessions").glob("*") if d.is_dir() and max((f.stat().st_mtime for f in d.iterdir()), default=0) < quiet]
    for d in ended:
        shutil.rmtree(d, ignore_errors=True)
    removed += ended
    trimmed = [f for pattern, keep in TAILS.items() for f in runtime.glob(pattern) if f.is_file() and trim(f, keep)]
    return {"removed": len(removed), "trimmed": len(trimmed)}


def trim(f: Path, keep: int) -> bool:
    if f.stat().st_size <= keep:
        return False
    with f.open("r+b") as held:
        held.seek(-keep, 2)
        tail = held.read()
        held.seek(0)
        held.write(tail)
        held.truncate()
    return True
