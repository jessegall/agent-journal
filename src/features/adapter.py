"""Runs an unswept 2.x handler under the 3.0 engine, so the sweep can move one feature at a time.

A 2.x handler takes a Context and writes through controllers; a 3.0 handler takes a fact, asks for its
services by type and returns the facts of what it did. OldHandler stands in the gap: it is a handler of
its event like any other, and it declares itself adapted, which is what exempts it from the rules a
swept feature is held to. It asks for one thing, the tick's record, and nothing else may ask for that.
"""

from dataclasses import dataclass

from events import Fact
from features.parts import Context, Handler as OldStyle
from receiving import Handler
from serving import Adapted as TheRecord

ON_THE_SENDING_PATH = {
    "RunTagCommands": "it answers a message about to be sent, which is a request and not a fact",
    "HideJournalOnlyTurns": "it answers a message about to be sent, which is a request and not a fact",
    "StripTags": "it answers a text about to be formatted, which is a request and not a fact",
}
"""A request is answered before anything writes, so a handler of one cannot run on the adapter at all. Those features are swept first."""


class CannotBeAdapted(TypeError):
    @classmethod
    def of(cls, handler: type, why: str) -> "CannotBeAdapted":
        return cls(f"{handler.__name__} cannot run on the adapter: {why}. Its feature is swept rather than adapted.")


@dataclass(frozen=True)
class Moved:
    """Where one feature stands: swept to the four kinds, or still running its handlers on the adapter."""

    feature: str
    adapted: tuple[str, ...] = ()

    @property
    def is_moved(self) -> bool:
        return not self.adapted

    def says(self) -> str:
        return f"{self.feature}: moved" if self.is_moved else f"{self.feature}: adapted ({', '.join(self.adapted)})"


class OldHandler(Handler[Fact]):
    """One 2.x handler, registered as a handler of the event it was written for."""

    adapted = True

    def __init__(self, feature, handler: OldStyle):
        if (why := ON_THE_SENDING_PATH.get(type(handler).__name__)) is not None:
            raise CannotBeAdapted.of(type(handler), why)
        self.feature, self.handler = feature, handler

    @classmethod
    def wants(cls) -> dict[str, type]:
        """The tick's record, and nothing else: a 2.x handler reaches for what it needs through the Context built over it."""
        return {"record": TheRecord}

    def handle(self, event, record) -> list[Fact]:
        """Runs the old handler against a Context over the tick's record. It dispatches nothing itself: whatever it wrote reaches the engine as the funnel's own resource facts."""
        self.handler.handle(Context.of(self.feature, record), event)
        return []


def moved(features, adapted: dict[str, tuple[str, ...]]) -> list[Moved]:
    """Every feature, and whether its handlers have moved to the four kinds or still run on the adapter. What `journal features moved` prints."""
    return [Moved(name, tuple(sorted(adapted.get(name, ())))) for name in sorted(features)]
