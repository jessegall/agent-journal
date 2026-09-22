import shutil
import time
from pathlib import Path

from engine.record import Record

TAILS = {"sessions/*/printed": 64 * 1024, "sessions/*/screen": 1024 * 1024, "*.log": 1024 * 1024}
EVENTS_KEPT = 100
READERS_WITHIN = 86400


def tidy(root: Path, days: float) -> dict:
    events = sum(Record(Path(root), env.name).trim_events(EVENTS_KEPT, time.time() - READERS_WITHIN)
                 for env in (Path(root) / "environments").glob("*") if (env / "events.jsonl").is_file())
    runtime = Path(root) / "runtime"
    if not runtime.is_dir():
        return {"removed": 0, "trimmed": 0, "events": events}
    quiet = time.time() - days * 86400
    removed = [d for d in (runtime / "sessions").glob("*") if d.is_dir() and max((f.stat().st_mtime for f in d.iterdir()), default=0) < quiet]
    for d in removed:
        shutil.rmtree(d, ignore_errors=True)
    trimmed = [f for pattern, keep in TAILS.items() for f in runtime.glob(pattern) if f.is_file() and trim(f, keep)]
    return {"removed": len(removed), "trimmed": len(trimmed), "events": events}


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
