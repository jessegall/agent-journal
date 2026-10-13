from dataclasses import dataclass, replace
from pathlib import Path

from controllers.types import CONTROLLERS
from engine.sessions import Sessions
from resources.base import Refused
from resources.files import RUNTIME
from resources.text import plural
from declaring.trigger import DAY
from serving import SERVED, Clock, Elsewhere, JournalRoot, Providers, ReadSessions

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


PROFILES, SESSIONS = f"{RUNTIME}/slow", f"{RUNTIME}/sessions"


@dataclass(frozen=True)
class Tidy:
    """The housekeeping of the journal's folder, over the services that reach it."""

    root: JournalRoot
    elsewhere: Elsewhere
    sessions: ReadSessions
    providers: Providers
    clock: Clock

    @classmethod
    def over(cls, record) -> "Tidy":
        """The journal's own services over a record, for whoever runs the housekeeping outside the engine's lanes."""
        from framework.lanes import TheClock, TheEnvironments, TheJournalRoot
        return cls(TheJournalRoot(record), TheEnvironments(None, record), Sessions(record.root), SERVED.given(Providers), TheClock())

    def everything(self, days: float) -> Tidied:
        events = self.root.trim_logs(EVENTS_KEPT, self.clock.now() - READERS_WITHIN)
        tidied = self.files(days)
        return replace(tidied, events=events, leftovers=tidied.leftovers + sum(self.drifted(env) for env in self.root.environments()))

    def drifted(self, env: str) -> int:
        """The totals of every type in an environment that had drifted from their rows, set right."""
        found, here = 0, self.elsewhere.named(env)
        for type_name in CONTROLLERS:
            try:
                found += here.rows_named(type_name).rows.drifted()
            except (OSError, Refused):
                continue
        return found

    def files(self, days: float) -> Tidied:
        left = self.leftovers()
        if not self.root.is_dir(RUNTIME):
            return Tidied(leftovers=left)
        now = self.clock.now()
        quiet, gone = now - days * DAY, now - GONE_FOR
        ended = self.sessions.ended()
        removed = [d for d in self.root.glob(f"{SESSIONS}/*") if self.root.is_dir(d) and self.newest(d) < (gone if Path(d).name in ended else quiet)]
        for d in removed:
            self.root.remove(d)
        spent = self.older(self.root.glob(f"{RUNTIME}/launches/*.log"), days * DAY)
        for f in spent:
            self.root.remove(f)
        trimmed = [f for pattern, keep in TAILS.items() for f in self.root.glob(f"{RUNTIME}/{pattern}")
                   if self.root.is_file(f) and not self.listened_to(f) and self.root.trim_tail(f, keep)]
        return Tidied(removed=len(removed), trimmed=len(trimmed), leftovers=left + len(spent))

    def leftovers(self) -> int:
        staged = [d for d in self.older(self.root.glob("plugins/.staging-*"), STAGING_FOR) if self.root.is_dir(d)]
        archived = [f for f in self.older(self.root.glob("attic/*.tar.gz"), ARCHIVES_FOR) if not Path(f).name.startswith("before-")]
        unkept = self.older(self.root.glob(f"{RUNTIME}/outputs/output-*"), OUTPUTS_FOR)
        profiled = sorted(self.root.glob(f"{PROFILES}/*.txt"), key=self.root.modified, reverse=True)[PROFILES_KEPT:]
        left = self.providers.stale_cache(FOLDS_FOR, OTHER_MARKS_FOR)
        marks, folds = [str(one) for one in left.folders], [str(one) for one in left.files]
        gone = staged + marks + archived + unkept + profiled + folds
        for each in gone:
            self.root.remove(each)
        return len(gone)

    def older(self, paths: list[str], age: float) -> list[str]:
        """Of these paths, the ones last written more than that many seconds ago."""
        now = self.clock.now()
        return [path for path in paths if (written := self.root.modified(path)) and now - written > age]

    def newest(self, folder_: str) -> float:
        return max((self.root.modified(each) for each in self.root.glob(f"{folder_}/*")), default=0.0)

    def listened_to(self, queue: str) -> bool:
        """A queue a channel is reading is never cut: the channel keeps its place by byte offset, and a cut would send it back to the start."""
        return Path(queue).suffix == ".jsonl" and Path(queue).parent.name == "channels" and self.clock.now() - self.root.modified(str(Path(queue).with_suffix(".on"))) < LISTENING_FOR


def tidy(record, days: float) -> Tidied:
    return Tidy.over(record).everything(days)


def tidy_files(record, days: float) -> Tidied:
    return Tidy.over(record).files(days)


def leftovers(record) -> int:
    return Tidy.over(record).leftovers()
