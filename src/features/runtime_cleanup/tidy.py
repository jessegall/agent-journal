import shutil
import time
from dataclasses import dataclass, replace
from pathlib import Path

from engine.runtime import folder, profiles, sessions
from engine.sessions import Sessions, alive
from providers.transcript_cache import FOLD_CACHE
from engine.record import Record
from engine.wording import plural
from controllers.stored import mtime
from features.trigger import DAY

TAILS = {"sessions/*/printed": 64 * 1024, "sessions/*/screen": 1024 * 1024, "*.log": 1024 * 1024, "launches/*.log": 1024 * 1024,
         "channels/*.jsonl": 1024 * 1024}
CAPTURES = ("printed", "screen")
ENDED_FOR = DAY
EVENTS_KEPT = 100
READERS_WITHIN = DAY
STAGING_FOR = 3600
OUTPUTS_FOR = DAY
ARCHIVES_FOR = 90 * DAY
PROFILES_KEPT = 50
FOLDS_FOR = 7 * DAY


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
    events = sum(Record(Path(root), env.name).event_log.trim(EVENTS_KEPT, time.time() - READERS_WITHIN)
                 for env in (Path(root) / "environments").glob("*") if (env / "events.jsonl").is_file())
    return replace(tidy_files(Path(root), days), events=events)


def tidy_files(root: Path, days: float) -> Tidied:
    left = leftovers(root)
    kept = folder(root)
    if not kept.is_dir():
        return Tidied(leftovers=left)
    quiet = time.time() - days * DAY
    removed = [d for d in sessions(root).glob("*") if d.is_dir() and max((mtime(f) / 1e9 for f in d.iterdir()), default=0) < quiet]
    for d in removed:
        shutil.rmtree(d, ignore_errors=True)
    spent = older(kept.glob("launches/*.log"), days * DAY) + older(ended_captures(root), ENDED_FOR)
    for f in spent:
        f.unlink(missing_ok=True)
    trimmed = [f for pattern, keep in TAILS.items() for f in kept.glob(pattern) if f.is_file() and trim(f, keep)]
    return Tidied(removed=len(removed), trimmed=len(trimmed), leftovers=left + len(spent))


def ended_captures(root: Path) -> list[Path]:
    ended = [name for name, session in Sessions(root).all().items() if not alive(session.pid)]
    return [f for name in ended for f in (sessions(root) / name / capture for capture in CAPTURES) if f.is_file()]


def older(paths, age: float) -> list[Path]:
    now = time.time()
    return [path for path in paths if mtime(path) and now - mtime(path) / 1e9 > age]


def leftovers(root: Path) -> int:
    staged = [d for d in older((root / "plugins").glob(".staging-*"), STAGING_FOR) if d.is_dir()]
    archived = [f for f in older((root / "attic").glob("*.tar.gz"), ARCHIVES_FOR) if not f.name.startswith("before-")]
    unkept = older((folder(root) / "outputs").glob("output-*"), OUTPUTS_FOR)
    profiled = sorted(profiles(root).glob("*.txt"), key=mtime, reverse=True)[PROFILES_KEPT:]
    folds = older(FOLD_CACHE.glob("*.pickle"), FOLDS_FOR)
    for d in staged:
        shutil.rmtree(d, ignore_errors=True)
    for f in archived + unkept + profiled + folds:
        f.unlink(missing_ok=True)
    return len(staged) + len(archived) + len(unkept) + len(profiled) + len(folds)


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
