import shutil
import time
from dataclasses import dataclass, replace
from pathlib import Path

from engine.runtime import folder, profiles, sessions
from engine.sessions import Sessions, alive
from providers.transcript_cache import FOLD_CACHE, STATES
from engine.record import Record
from engine.wording import plural
from controllers.stored import mtime
from resources.base import Refused
from features.trigger import DAY

TAILS = {"sessions/*/printed": 64 * 1024, "sessions/*/screen": 1024 * 1024, "*.log": 1024 * 1024, "launches/*.log": 1024 * 1024,
         "channels/*.jsonl": 1024 * 1024}
GONE_FOR = 6 * 3600
EVENTS_KEPT = 100
READERS_WITHIN = DAY
STAGING_FOR = 3600
OUTPUTS_FOR = DAY
ARCHIVES_FOR = 90 * DAY
PROFILES_KEPT = 50
FOLDS_FOR = 7 * DAY
OTHER_MARKS_FOR = DAY
LISTENING_FOR = 60


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
    records = Record.every(Path(root))
    logs = [record.event_log for record in records] + [record.event_log.project for record in records[:1]]
    events = sum(log.trim(EVENTS_KEPT, time.time() - READERS_WITHIN) for log in logs)
    tidied = tidy_files(Path(root), days)
    return replace(tidied, events=events, leftovers=tidied.leftovers + sum(drifted_totals(record) for record in records))


def drifted_totals(record: Record) -> int:
    """The totals of every type in a record that had drifted from their rows, set right."""
    from controllers.base import CONTROLLERS
    from resources.base import SYSTEM
    found = 0
    for controller in CONTROLLERS.values():
        try:
            found += controller(record, actor=SYSTEM).rows.drifted()
        except (OSError, Refused):
            continue
    return found


def tidy_files(root: Path, days: float) -> Tidied:
    left = leftovers(root)
    kept = folder(root)
    if not kept.is_dir():
        return Tidied(leftovers=left)
    quiet = time.time() - days * DAY
    gone = time.time() - GONE_FOR
    ended = set(ended_sessions(root))
    removed = [d for d in sessions(root).glob("*") if d.is_dir() and max((mtime(f) / 1e9 for f in d.iterdir()), default=0) < (gone if d.name in ended else quiet)]
    for d in removed:
        shutil.rmtree(d, ignore_errors=True)
    spent = older(kept.glob("launches/*.log"), days * DAY)
    for f in spent:
        f.unlink(missing_ok=True)
    trimmed = [f for pattern, keep in TAILS.items() for f in kept.glob(pattern) if f.is_file() and not listened_to(f) and trim(f, keep)]
    return Tidied(removed=len(removed), trimmed=len(trimmed), leftovers=left + len(spent))


def listened_to(f: Path) -> bool:
    """A queue a channel is reading is never cut: the channel keeps its place by byte offset, and a cut would send it back to the start."""
    return f.suffix == ".jsonl" and f.parent.name == "channels" and time.time() - mtime(f.with_suffix(".on")) / 1e9 < LISTENING_FOR


def ended_sessions(root: Path) -> list[str]:
    return [name for name, session in Sessions(root).all().items() if not alive(session.pid)]


def older(paths, age: float) -> list[Path]:
    now = time.time()
    return [path for path in paths if mtime(path) and now - mtime(path) / 1e9 > age]


def leftovers(root: Path) -> int:
    staged = [d for d in older((root / "plugins").glob(".staging-*"), STAGING_FOR) if d.is_dir()]
    archived = [f for f in older((root / "attic").glob("*.tar.gz"), ARCHIVES_FOR) if not f.name.startswith("before-")]
    unkept = older((folder(root) / "outputs").glob("output-*"), OUTPUTS_FOR)
    profiled = sorted(profiles(root).glob("*.txt"), key=mtime, reverse=True)[PROFILES_KEPT:]
    marks = [d for d in older(FOLD_CACHE.glob("*"), OTHER_MARKS_FOR) if d.is_dir() and d.name != STATES]
    folds = [*FOLD_CACHE.glob("*.pickle"), *older((FOLD_CACHE / STATES).glob("*.pickle"), FOLDS_FOR),
             *older((FOLD_CACHE / STATES).glob("*.tmp"), OTHER_MARKS_FOR)]
    for d in staged + marks:
        shutil.rmtree(d, ignore_errors=True)
    for f in archived + unkept + profiled + folds:
        f.unlink(missing_ok=True)
    return len(staged) + len(marks) + len(archived) + len(unkept) + len(profiled) + len(folds)


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
