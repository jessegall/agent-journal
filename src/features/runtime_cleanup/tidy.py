import shutil
import time
from pathlib import Path

from engine.record import Record
from engine.wording import plural

TAILS = {"sessions/*/printed": 64 * 1024, "sessions/*/screen": 1024 * 1024, "*.log": 1024 * 1024, "channel.jsonl": 1024 * 1024}
EVENTS_KEPT = 100
READERS_WITHIN = 86400
STAGING_FOR = 3600
OUTPUTS_FOR = 86400
ARCHIVES_FOR = 90 * 86400


def tidy(root: Path, days: float) -> dict:
    events = sum(Record(Path(root), env.name).trim_events(EVENTS_KEPT, time.time() - READERS_WITHIN)
                 for env in (Path(root) / "environments").glob("*") if (env / "events.jsonl").is_file())
    left = leftovers(Path(root))
    runtime = Path(root) / "runtime"
    if not runtime.is_dir():
        return {"removed": 0, "trimmed": 0, "events": events, "leftovers": left}
    quiet = time.time() - days * 86400
    removed = [d for d in (runtime / "sessions").glob("*") if d.is_dir() and max((f.stat().st_mtime for f in d.iterdir()), default=0) < quiet]
    for d in removed:
        shutil.rmtree(d, ignore_errors=True)
    trimmed = [f for pattern, keep in TAILS.items() for f in runtime.glob(pattern) if f.is_file() and trim(f, keep)]
    return {"removed": len(removed), "trimmed": len(trimmed), "events": events, "leftovers": left}


def leftovers(root: Path) -> int:
    now = time.time()
    staged = [d for d in (root / "plugins").glob(".staging-*") if d.is_dir() and now - d.stat().st_mtime > STAGING_FOR]
    archived = [f for f in (root / "attic").glob("*.tar.gz") if not f.name.startswith("before-") and now - f.stat().st_mtime > ARCHIVES_FOR]
    unkept = [f for f in (root / "runtime" / "outputs").glob("output-*") if now - f.stat().st_mtime > OUTPUTS_FOR]
    for d in staged:
        shutil.rmtree(d)
    for f in archived + unkept:
        f.unlink()
    return len(staged) + len(archived) + len(unkept)


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


def summary(done: dict) -> str:
    parts = [f"{plural(done['trimmed'], 'log')} cut to their tail" if done["trimmed"] else "",
             f"{plural(done['removed'], 'quiet session folder')} removed" if done["removed"] else "",
             f"{plural(done['events'], 'old event')} dropped" if done["events"] else "",
             f"{plural(done['leftovers'], 'leftover')} removed" if done["leftovers"] else ""]
    return "; ".join(part for part in parts if part) or "nothing to tidy"
