"""Runs one registration through the entry the engine really uses, and reads what it did from the record.

On 2.x a handler takes a Context and writes through controllers, so the rows are a temporary real Record
built from the Given and the outcomes about rows are read from what that record gained. The Fakes stand
in for everything that is not the record: the clock, the ids, the commands, the files, the processes and
the providers. Each kind has one entry and no kind has two, so the run and the engine cannot disagree.
"""

import tempfile
from pathlib import Path

from controllers.types import Messages, Nudges
from engine.record import Record
from expects import Given
from expects.playing import Seen, World
from features.parts import Context
from resources.base import SYSTEM
from tests import isolation


class NoEntryForThisKind(LookupError):
    @classmethod
    def of(cls, kind: str) -> "NoEntryForThisKind":
        return cls(f"there is no way to play a {kind!r} registration yet; the run plays {', '.join(sorted(ENTRIES))}")


def scratch(given: Given) -> Record:
    """A record holding just what the Given states, thrown away when the play ends."""
    record = Record(Path(tempfile.mkdtemp(dir=isolation.world())) / ".journal", "t")
    record.home.mkdir(parents=True)
    for name, value in dict(given.settings).items():
        part, _, key = name.partition(".")
        record.change_setting(part or "features", {key or part: value})
    return record


def what_was_said(record: Record) -> tuple[list, list]:
    """What reached the chat and what was nudged, read from the rows the journal keeps rather than from anything the play says about itself."""
    said = [row.brief or row.title for row in Messages(record, actor=SYSTEM).all(completed=True) if row.seen[:1] == ["agent"]]
    nudged = [(row.line, ()) for row in Nudges(record, actor=SYSTEM).all(completed=True)]
    return said, nudged


def rows_now(record: Record) -> tuple:
    from resources.types import TYPES
    from controllers.types import CONTROLLERS
    return tuple(sorted((name, len(CONTROLLERS[name](record, actor=SYSTEM).rows.every()))
                        for name in TYPES if name in CONTROLLERS))


def handled(promise, given: Given, record: Record, world: World) -> None:
    """A 2.x handler, through the entry the bus uses: its own handle, with a Context over the tick's record."""
    promise.part.handle(Context.of(promise.feature, record), given.on)


def formatted(promise, given: Given, record: Record, world: World) -> None:
    """A formatter, through its own format. It is a pure function of its text, so what it answers IS the outcome."""
    world.seen.changed = promise.part.format(Context.of(promise.feature, record), given.on)


def intercepted(promise, given: Given, record: Record, world: World) -> None:
    """An interceptor, through its own intercept. It answers a refusal, or nothing when it lets the call through."""
    why = promise.part.intercept(Context.of(promise.feature, record), given.on)
    world.seen.refused = why or None


ENTRIES = {"handler": handled, "formatter": formatted, "interceptor": intercepted}


def played(promise, expectation) -> Seen:
    """Builds the world the Given states, runs the registration through its own entry, and reads what it did."""
    if promise.kind not in ENTRIES:
        raise NoEntryForThisKind.of(promise.kind)
    given = expectation.given
    record, world = scratch(given), World.of(given)
    world.seen.before = rows_now(record)
    ENTRIES[promise.kind](promise, given, record, world)
    world.seen.after = rows_now(record)
    world.seen.said, world.seen.nudged = what_was_said(record)
    return world.seen
