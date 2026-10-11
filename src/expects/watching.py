"""A handler that runs for real is held to what its expectations say, once the world it ran in is seen to be one of theirs.

A Given builds a world; here the world is already there, so the Given is tested against it: the same event, the settings and
remembered state it names, and rows it names that really exist, their numbers read as names and bound to the live ones. When
one of a handler's expectations is satisfied, what it says the handler writes, changes or nudges is owed, and after a wait the
record is read for it. Nothing happening is never judged, so only the outcomes that assert something are owed.
"""

import copy
import time
from dataclasses import dataclass, field, fields, is_dataclass, replace

from controllers.types import CONTROLLERS, Nudges
from engine.extension import Extension
from engine.record import Record
from expects import File, Given, Nudged, Updated, Wrote, contains, held, named, stated
from expects.playing import Seen
from resources.base import SYSTEM

WAIT = 60.0
OWED = (Wrote, Updated, Nudged)
STAGED = ("clock", "ids", "chat", "commands", "files", "processes", "providers", "transcript", "held", "hook")
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


def satisfied(given: Given, event, record: Record) -> Binding | None:
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
    from expects.entries import remembered_by
    for name, value in dict(given.remembered).items():
        owner, _, key = name.partition(".")
        if not contains(remembered_by(record, owner or name).get(key or name), value):
            return False
    return True


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


def gained(record: Record, since: int) -> Seen:
    """What the record gained after the mark, read from the events the writes left: the rows created, the rows changed and the nudges sent."""
    seen = Seen()
    nudges = Nudges(record, actor=SYSTEM).type
    for event in record.event_log.events(since):
        if event.type not in CONTROLLERS:
            continue
        try:
            row = CONTROLLERS[event.type](record, actor=SYSTEM).rows.peek(event.n)
        except LookupError:
            continue
        if row is None:
            continue
        if event.action != "created":
            seen.updated.append(row)
            continue
        seen.wrote.append(row)
        if event.type == nudges:
            seen.nudged.append((row.line, row.title, row.brief))
    return seen


@dataclass
class Owed:
    """What one satisfied expectation says is to come, and what it was satisfied by."""

    promise: object
    number: int
    given: Given
    binding: Binding
    outcomes: tuple
    record: Record
    since: int
    due: float

    def broken(self) -> list[str]:
        seen = gained(Record(self.record.root, self.record.env), self.since)
        return [why for outcome in self.outcomes if (why := outcome.holds(seen))]

    def title(self) -> str:
        return f"{self.promise.name} did not do what expectation {self.number} says"[:80]

    def brief(self, whys: list[str]) -> str:
        rows = ", ".join(named(row) for row in self.given.rows) or "none"
        bound = ", ".join(f"{kind} {one}→{live}" for (kind, one), live in sorted(self.binding.numbers.items())) or "none"
        return (f"{self.promise.feature.name}/{self.promise.name}: {'; '.join(whys)}. The world it ran in was the one expectation {self.number} states: "
                f"the event {self.given.on!r} and the rows {rows}, whose numbers are the live ones {bound}. The record was read {WAIT:.0f} seconds after the run. "
                f"If this is not a fault, a live row the expectation does not state made the handler do right: tighten the matching in src/expects/watching.py.")


class Watch:
    """The runs waiting to be looked at, and the look at them once their wait is over."""

    def __init__(self):
        self.pending: list[Owed] = []

    def around(self, promise, event, record: Record):
        """Called as a handler runs: sweeps what is due, and once the handler has run notes the expectations of it that the world satisfied."""
        return Running(self, promise, event, record)

    def sweep(self, now: float | None = None) -> None:
        now = time.time() if now is None else now
        due, self.pending = [one for one in self.pending if one.due <= now], [one for one in self.pending if one.due > now]
        for one in due:
            whys = one.broken()
            if whys:
                tell(one.record, one.title(), one.brief(whys))


@dataclass
class Running:
    watch: Watch
    promise: object
    event: object
    record: Record

    def __enter__(self):
        guarded(self.watch.sweep, self.record)
        self.applying = guarded(self.applying_now, self.record) or []
        self.since = self.record.event_log.last_id() if self.applying else 0
        return self

    def __exit__(self, kind, error, trace) -> None:
        if error is None and self.applying:
            guarded(self.noted, self.record)

    def applying_now(self) -> list:
        found_ = []
        for number, expectation in enumerate(self.promise.expects):
            owed = tuple(one for one in expectation.outcomes.each if isinstance(one, OWED) and not isinstance(getattr(one, "row", None), File))
            binding = satisfied(expectation.given, self.event, self.record) if owed else None
            if binding is not None:
                found_.append((number, expectation.given, binding, tuple(renumbered(one, binding) for one in owed)))
        return found_

    def noted(self) -> None:
        for number, given, binding, outcomes in self.applying:
            self.watch.pending.append(Owed(self.promise, number, given, binding, outcomes, self.record, self.since, time.time() + WAIT))


def tell(record: Record, title: str, brief: str) -> None:
    for entry in BROKEN.entries:
        entry.value(record, title, brief)


def guarded(call, record: Record):
    """Whatever the watching does, it never reaches the thing it watches: a fault of its own is told as a fault and the run carries on."""
    try:
        return call()
    except Exception as fault:
        tell(record, "the expectation watching failed", f"{type(fault).__name__}: {fault}"[:300])
        return None


WATCH = Watch()
