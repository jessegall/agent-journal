import shutil
import time
from dataclasses import dataclass, replace
from pathlib import Path

from engine.record import Record
from engine.wording import plural

TAILS = {"sessions/*/printed": 64 * 1024, "sessions/*/screen": 1024 * 1024, "*.log": 1024 * 1024, "channel.jsonl": 1024 * 1024}
EVENTS_KEPT = 100
READERS_WITHIN = 86400
STAGING_FOR = 3600
OUTPUTS_FOR = 86400
ARCHIVES_FOR = 90 * 86400


@dataclass(frozen=True)
class Tidied:
    removed: int = 0
    trimmed: int = 0
    events: int = 0
    leftovers: int = 0

    @property
    def summary(self) -> str:
        parts = [f"{plural(self.trimmed, 'log')} cut to their tail" if self.trimmed else "",
                 f"{plural(self.removed, 'quiet session folder')} removed" if self.removed else "",
                 f"{plural(self.events, 'old event')} dropped" if self.events else "",
                 f"{plural(self.leftovers, 'leftover')} removed" if self.leftovers else ""]
        found = "; ".join(part for part in parts if part)
        return found if found else "nothing to tidy"


def tidy(root: Path, days: float) -> Tidied:
    events = sum(Record(Path(root), env.name).trim_events(EVENTS_KEPT, time.time() - READERS_WITHIN)
                 for env in (Path(root) / "environments").glob("*") if (env / "events.jsonl").is_file())
    return replace(tidy_files(Path(root), days), events=events)


def tidy_files(root: Path, days: float) -> Tidied:
    left = leftovers(root)
    runtime = root / "runtime"
    if not runtime.is_dir():
        return Tidied(leftovers=left)
    quiet = time.time() - days * 86400
    removed = [d for d in (runtime / "sessions").glob("*") if d.is_dir() and max((f.stat().st_mtime for f in d.iterdir()), default=0) < quiet]
    for d in removed:
        shutil.rmtree(d, ignore_errors=True)
    trimmed = [f for pattern, keep in TAILS.items() for f in runtime.glob(pattern) if f.is_file() and trim(f, keep)]
    return Tidied(removed=len(removed), trimmed=len(trimmed), leftovers=left)


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


def summary(done: Tidied) -> str:
    return done.summary
