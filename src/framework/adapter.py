"""Runs an unswept 2.x handler under the 3.0 engine, so the sweep can move one feature at a time.

A 2.x handler takes a Context and writes through controllers; a 3.0 handler takes a fact, asks for its
services by type and returns the facts of what it did. OldHandler stands in the gap: it is a handler of
its event like any other, and it declares itself adapted, which is what exempts it from the rules a
swept feature is held to. It asks for one thing, the tick's record, and nothing else may ask for that.
"""

from dataclasses import dataclass

from controllers.features import MOVED
from engine import bus
from events import Fact, Request
from framework.parts import Context, Handler as OldStyle
from receiving import HANDLE, Handler, Registration, Registrations
from serving import Adapted as TheRecord

ON_THE_SENDING_PATH = {
    "RunTagCommands": "it answers a message about to be sent, which is a request and not a fact",
    "HideJournalOnlyTurns": "it answers a message about to be sent, which is a request and not a fact",
    "StripTags": "it answers a text about to be formatted, which is a request and not a fact",
}
"""A request is answered before anything writes, so a handler of one cannot run on the adapter at all. Those features are swept first."""


ADAPTED = Registrations()
"""The old handlers on the adapter, kept apart from the registry of the swept features, so removing the adapter removes them whole and nothing that clears the registry takes them with it."""

NOT_ADAPTABLE: dict[tuple[str, str], str] = {}
"""The old handlers that could not be put on the adapter, by feature and name, with why: the listing names them, so no feature reads as moved while one is left."""


class CannotBeAdapted(TypeError):
    @classmethod
    def of(cls, handler: type, why: str) -> "CannotBeAdapted":
        return cls(f"{handler.__name__} cannot run on the adapter: {why}. Its feature is swept rather than adapted.")


@dataclass(frozen=True)
class Moved:
    """Where one feature stands: swept to the four kinds, or still running its handlers on the adapter, or holding a handler that cannot run there until the feature is swept."""

    feature: str
    adapted: tuple[str, ...] = ()
    stuck: tuple[str, ...] = ()

    @property
    def is_moved(self) -> bool:
        return not self.adapted and not self.stuck

    def says(self) -> str:
        if self.is_moved:
            return f"{self.feature}: moved"
        parts = [f"adapted ({', '.join(self.adapted)})"] if self.adapted else []
        parts += [f"cannot be adapted ({', '.join(self.stuck)}), swept first"] if self.stuck else []
        return f"{self.feature}: {'; '.join(parts)}"


class OldHandler(Handler[Fact]):
    """One 2.x handler, registered as a handler of the event it was written for."""

    adapted = True

    def called(self) -> str:
        return type(self.handler).__name__

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


def moved(features, adapted: dict[str, tuple[str, ...]], stuck: dict[str, tuple[str, ...]]) -> list[Moved]:
    """Every feature, and whether its handlers have moved to the four kinds or still run on the adapter. What `journal feature moved` prints."""
    return [Moved(name, tuple(sorted(adapted.get(name, ()))), tuple(sorted(stuck.get(name, ())))) for name in sorted(features)]


@dataclass(frozen=True, kw_only=True)
class OldEvent(Fact):
    """A bridge: a logged event wrapped so the lane can carry it to the old handlers. The row that removes the adapter removes this class."""

    logged: object


class LoggedHandler(OldHandler):
    """An old handler on the adapter beside the bus: it hears an OldEvent and runs for the events the bus would have given it."""

    def __init__(self, feature, handler: OldStyle, run, kind):
        if getattr(kind, "marked_as", Fact) is Request:
            raise CannotBeAdapted.of(type(handler), "it answers a request, which is read before anything writes and not handled after")
        super().__init__(feature, handler)
        self.run, self.kind = run, kind

    def hears(self, logged, record) -> bool:
        """Whether the bus would have given the handler this event: a pattern it listened on, and its feature on."""
        return bool(set(bus.patterns(logged)) & set(self.kind.patterns(self.handler.hooks))) and self.feature.enabled(record)

    def handle(self, event: OldEvent, record) -> list[Fact]:
        """Runs the bus's own run of the handler, so the adapter holds no second way to read the event or build the Context."""
        if self.hears(event.logged, record):
            self.run(event.logged, record)
        return []


def adapted_beside_the_bus(feature, handler: OldStyle, run, kind) -> None:
    """Registers an old handler on the adapter too, once. Nothing dispatches an OldEvent yet, so it runs nothing."""
    try:
        receiver = LoggedHandler(feature, handler, run, kind)
    except CannotBeAdapted as refusal:
        NOT_ADAPTABLE[feature.name, type(handler).__name__] = str(refusal)
        return
    ADAPTED.forget(HANDLE, feature.name, receiver.called())
    ADAPTED.add(Registration.read(HANDLE, OldEvent, receiver, (), feature.name))


def listing() -> str:
    """Per feature, adapted or moved: what `journal feature moved` prints."""
    from framework.loaded import FEATURES
    adapted: dict[str, list[str]] = {}
    for one in ADAPTED.of(HANDLE):
        adapted.setdefault(one.feature, []).append(one.name)
    stuck: dict[str, list[str]] = {}
    for (feature, name) in NOT_ADAPTABLE:
        stuck.setdefault(feature, []).append(name)
    return "\n".join(one.says() for one in moved(FEATURES, {k: tuple(v) for k, v in adapted.items()}, {k: tuple(v) for k, v in stuck.items()}))


MOVED.add(None, listing)
