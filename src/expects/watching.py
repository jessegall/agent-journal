"""A handler that runs for real is held to what its expectations say, once the world it ran in is seen to be one of theirs.

A Given builds a world; here the world is already there, so the Given is tested against it: the same event, the settings and
remembered state it names, and rows it names that really exist, their numbers read as names and bound to the live ones. When
one of a handler's expectations is satisfied, what it says the handler writes, changes or nudges is owed, and after a wait the
record is read for it. Nothing happening is never judged, so only the outcomes that assert something are owed.
"""

import traceback
import copy
import queue
import threading
import time
from dataclasses import dataclass, field, fields, is_dataclass, replace
from pathlib import Path

from controllers.types import CONTROLLERS, Nudges
from resources.extension import Extension
from engine.record import Record
from expects import File, Given, Nudged, Updated, Wrote, contains, held, matches, named, stated
from expects.playing import Seen, remembered_by
from resources.base import SYSTEM

WAIT = 60.0
IDLE = 5.0
OWED = (Wrote, Updated, Nudged)
UNSTAGED = ("on", "earlier", "rows", "settings", "remembered")
STAGED = tuple(name for name in Given.__dataclass_fields__ if name not in UNSTAGED)
"""Every field of a Given that builds a world the live one cannot be: a field added to the Given is staged by default, so no Fake can be left out."""
DEFAULTS = {name: Given.__dataclass_fields__[name].default for name in STAGED}
AGES = 1_000_000_000
BROKEN = Extension()
"""Where a broken promise is told: a feature adds `(record, title, brief)` here, and nothing in the watching knows how it reaches anyone."""


@dataclass
class Binding:
    """The numbers a Given names, which are only names of a row of a kind, read as the live rows' numbers, and the kind each reference field was found to point at."""

    numbers: dict = field(default_factory=dict)
    refs: dict = field(default_factory=dict)

    def bind(self, kind: str, given, live) -> bool:
        return self.numbers.setdefault((kind, given), live) == live

    def of(self, kind: str, value):
        return self.numbers.get((kind, value), value) if is_number(value) else value


def is_number(value) -> bool:
    return isinstance(value, int) and not isinstance(value, bool)


def pointed_at(name: str, want: int, kinds: dict) -> str:
    """The kind of row a field holding this number points at: the one the field is named for, or the only kind of row the Given numbers so; none when it could be several."""
    candidates = kinds.get(want, set())
    if name in candidates:
        return name
    return next(iter(candidates)) if len(candidates) == 1 else ""


def fits(wanted: dict, live: dict, kind: str, kinds: dict, binding: Binding) -> bool:
    """Whether what a Given states of one row or event is true of a live one. A stated number that is some stated row's number is a reference, bound under the kind it points at; an age the Given states cannot be met by a live clock, so it fits nothing."""
    for name, want in wanted.items():
        if isinstance(want, float) and want >= AGES:
            return False
        if name not in live:
            return False
        if name == "n":
            if not binding.bind(kind, want, live[name]):
                return False
        elif is_number(want) and want in kinds:
            pointed = binding.refs.setdefault(name, pointed_at(name, want, kinds))
            if not pointed or not binding.bind(pointed, want, live[name]):
                return False
        elif not contains(live[name], want):
            return False
    return True


def satisfied(given: Given, event, record: Record, feature: str = "") -> Binding | None:
    """The binding by which the live world is the world this Given states, or nothing when it is not that world."""
    if any(getattr(given, name) != DEFAULTS[name] for name in STAGED) or not is_dataclass(given.on):
        return None
    if not isinstance(event, type(given.on)):
        return None
    kinds: dict = {}
    for one in (given.on, *given.rows):
        if is_number(stated(one).get("n")):
            kinds.setdefault(stated(one)["n"], set()).add(kind_of(one))
    binding = Binding()
    if not fits(stated(given.on), held(event), kind_of(given.on), kinds, binding) or not settled(given, record) or not remembered(given, record):
        return None
    if not given.remembered and marked(record, feature):
        return None
    return binding if all(found(row, record, kinds, binding) for row in given.rows) else None


def kind_of(one) -> str:
    """The kind of row or event a thing is: the type it carries, or its class's name."""
    return getattr(one, "type", "") or type(one).__name__.lower()


def settled(given: Given, record: Record) -> bool:
    for name, value in dict(given.settings).items():
        part, _, key = name.partition(".")
        if not contains(record.setting(part or "features", {}).get(key or part), value):
            return False
    return True


def remembered(given: Given, record: Record) -> bool:
    for name, value in dict(given.remembered).items():
        owner, _, key = name.partition(".")
        if not contains(remembered_by(record, owner or name).get(key or name), value):
            return False
    return True


def marked(record: Record, feature: str) -> bool:
    """Whether the feature's own trigger has already fired for a live agent. A registration that acts once and keeps a mark saying so is right to stay quiet the second time, and a Given that names no remembered state is not a statement about that world: judging it there accuses a handler of breaking a promise it kept."""
    return bool(feature) and any(name == feature or name.startswith(f"{feature}.") for name in remembered_by(record, feature))


def found(row, record: Record, kinds: dict, binding: Binding) -> bool:
    """Whether a live row is the one a Given states, taking the first that fits and keeping the numbers it bound."""
    kind = kind_of(row)
    if kind not in CONTROLLERS:
        return False
    for live in CONTROLLERS[kind](record, actor=SYSTEM).rows.every():
        trial = Binding(dict(binding.numbers), dict(binding.refs))
        if fits(stated(row), held(live), kind, kinds, trial):
            binding.numbers, binding.refs = trial.numbers, trial.refs
            return True
    return False


def renumbered(outcome, binding: Binding):
    """The outcome with the numbers the Given named replaced by the live ones, in the fields found to hold a number and in the row's own."""
    if not isinstance(outcome, (Wrote, Updated)) or not is_dataclass(outcome.row):
        return outcome
    row = outcome.row
    kinds = {**binding.refs, "n": kind_of(row)}
    changes = {one.name: binding.of(kinds[one.name], getattr(row, one.name)) for one in fields(row) if one.name in kinds}
    if getattr(row, "data", None):
        changes["data"] = {key: binding.of(kinds[key], value) if key in kinds else value for key, value in row.data.items()}
    renamed = copy.copy(outcome)
    object.__setattr__(renamed, "row", replace(row, **changes))
    if isinstance(outcome, Updated):
        object.__setattr__(renamed, "changed", tuple((key, binding.of(kinds[key], value) if key in kinds else value) for key, value in outcome.changed))
    return renamed


def already_held(outcome, record: Record) -> bool:
    """Whether the row an Updated outcome names holds what it is to hold, read from the record as it is now."""
    if not isinstance(outcome, Updated):
        return False
    wanted = {**stated(outcome.row), **dict(outcome.changed)}
    try:
        row = CONTROLLERS[kind_of(outcome.row)](record, actor=SYSTEM).rows.peek(wanted["n"])
    except LookupError:
        return False
    return row is not None and matches(row, wanted)


def gained(record: Record, began: float) -> Seen:
    """What the record gained from the mark on, read from the events the writes left: the rows created, the rows changed and the nudges sent."""
    wrote, updated, nudged = [], [], []
    nudges = Nudges(record, actor=SYSTEM).type
    for event in record.event_log.events(where=lambda one: one.at >= began):
        if event.type not in CONTROLLERS:
            continue
        try:
            row = CONTROLLERS[event.type](record, actor=SYSTEM).rows.peek(event.n)
        except LookupError:
            continue
        if row is None:
            continue
        if event.action != "created":
            updated.append(row)
            continue
        wrote.append(row)
        if event.type == nudges:
            nudged.append((row.line, row.title, row.brief))
    return Seen(wrote=tuple(wrote), updated=tuple(updated), nudged=tuple(nudged))


@dataclass
class Ran:
    """All the handler's path leaves behind: which registration ran, on what, where, and when."""

    promise: object
    event: object
    root: Path
    env: str
    began: float

    @property
    def record(self) -> Record:
        return Record(self.root, self.env)


@dataclass
class Owed:
    """What one satisfied expectation says is to come, and what it was satisfied by."""

    ran: Ran
    number: int
    given: Given
    binding: Binding
    outcomes: tuple
    due: float

    def broken(self) -> list[str]:
        """What is owed and not there. A line the handler asked to say counts as said, since whether it reaches the agent now is the journal's call, and
        a row the handler had nothing to change in, as it already held what it was to be changed to, counts as changed."""
        record = self.ran.record
        spoken = tuple((one.line, "", one.words) for one in self.ran.promise.feature.journal.spoken if one.at >= self.ran.began)
        seen = gained(record, self.ran.began)
        seen = replace(seen, nudged=seen.nudged + spoken)
        return [why for outcome in self.outcomes if not already_held(outcome, record) and (why := outcome.holds(seen))]

    def title(self) -> str:
        return f"{self.ran.promise.name} did not do what expectation {self.number} says"[:80]

    def brief(self, whys: list[str]) -> str:
        rows = ", ".join(named(row) for row in self.given.rows) or "none"
        bound = ", ".join(f"{kind} {one}→{live}" for (kind, one), live in sorted(self.binding.numbers.items())) or "none"
        promise = self.ran.promise
        return (f"{promise.feature.name}/{promise.name}: {'; '.join(whys)}. The world it ran in was the one expectation {self.number} states: "
                f"the event {self.given.on!r} and the rows {rows}, whose numbers are the live ones {bound}. The record was read {WAIT:.0f} seconds after the run. "
                f"If this is not a fault, a live row the expectation does not state made the handler do right: tighten the matching in src/expects/watching.py.")


class Watch:
    """The runs waiting to be looked at, and the looking, which is done off the path of the thing watched: the handler's path only queues a note."""

    def __init__(self, background: bool = True):
        self.inbox: queue.SimpleQueue = queue.SimpleQueue()
        self.pending: list[Owed] = []
        self.background = background
        self.worker: threading.Thread | None = None

    def ran(self, promise, event, record: Record | None, began: float) -> None:
        """Notes that a handler ran, and nothing more. A run with no record cannot be watched: there is nothing to read what it did from."""
        if record is None:
            return
        self.inbox.put(Ran(promise, event, record.root, record.env, began))
        if self.background and (self.worker is None or not self.worker.is_alive()):
            self.worker = threading.Thread(target=self.work, name="expectation-watch", daemon=True)
            self.worker.start()

    def work(self) -> None:
        while True:
            try:
                self.settle(self.inbox.get(timeout=IDLE))
            except queue.Empty:
                pass
            self.sweep()

    def settle(self, ran: Ran | None = None) -> None:
        """Tests each noted run against the world as it is now and keeps the expectations it satisfies; with none given, every run noted."""
        notes = [ran] if ran is not None else [self.inbox.get() for _ in range(self.inbox.qsize())]
        for note in notes:
            guarded(lambda: self.pending.extend(self.satisfying(note)), note.record)

    @staticmethod
    def satisfying(ran: Ran) -> list[Owed]:
        record, found_ = ran.record, []
        for number, expectation in enumerate(ran.promise.expects):
            owed = tuple(one for one in expectation.outcomes.each if isinstance(one, OWED) and not isinstance(getattr(one, "row", None), File))
            binding = satisfied(expectation.given, ran.event, record, ran.promise.feature.name) if owed else None
            if binding is not None:
                found_.append(Owed(ran, number, expectation.given, binding, tuple(renumbered(one, binding) for one in owed), ran.began + WAIT))
        return found_

    def sweep(self, now: float | None = None) -> None:
        now = time.time() if now is None else now
        due, self.pending = [one for one in self.pending if one.due <= now], [one for one in self.pending if one.due > now]
        for one in due:
            whys = guarded(one.broken, one.ran.record) or []
            if whys:
                tell(one.ran.record, one.title(), one.brief(whys))


def tell(record: Record, title: str, brief: str) -> None:
    for entry in BROKEN.entries:
        entry.value(record, title, brief)


def guarded(call, record: Record):
    """Whatever the watching does, it never reaches the thing it watches: a fault of its own is told as a fault and the work carries on."""
    try:
        return call()
    except Exception as fault:
        where = traceback.extract_tb(fault.__traceback__)[-1]
        tell(record, "the expectation watching failed", f"{type(fault).__name__}: {fault} at {where.filename}:{where.lineno} in {where.name}"[:300])
        return None


WATCH = Watch()
