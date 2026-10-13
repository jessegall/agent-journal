"""Runs an unswept 2.x handler under the 3.0 engine, so the sweep can move one feature at a time.

A 2.x handler takes a Context and writes through controllers; a 3.0 handler takes a fact, asks for its
services by type and returns the facts of what it did. OldHandler stands in the gap: it is a handler of
its event like any other, and it declares itself adapted, which is what exempts it from the rules a
swept feature is held to. It asks for one thing, the tick's record, and nothing else may ask for that.
"""

from dataclasses import dataclass, replace

from declaring.registries import MOVED
from engine import bus
from engine.record import Record
from events import Fact, Request
from events.typed import AgentEvent, TypedEvent
from engine.developing import developing
from expects.watching import WATCH, tell
from framework.loaded import FEATURES
from framework.lanes import agent_of, agent_of_fact, answering, due_now, lane_services
from framework.parts import Context, Handler as OldStyle
from framework.promises import THE_ENGINES_OWN, Promise
from receiving import HANDLE, LISTEN, REGISTERED, Handler, Listener, Registration, Registrations
from receiving.boot import walked
from receiving.ordering import InOrder
from receiving.ticks import Claims, Lane, Services, TickFailed
from resources.base import ACTIONS
from resources.types import TYPES
from serving import Adapted as TheRecord

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


def ran_on_the_bus(receiver, event: "OldEvent", record) -> list[Fact]:
    """What a receiver of the lane does in place of the bus: hands the logged event to what the bus would have run, if this one would have heard it. It dispatches nothing: whatever the listener wrote reaches the engine as the funnel's own resource facts."""
    if receiver.hears(event.logged, record):
        receiver.listener(event.logged, record)
    return []


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
        self.listener, self.kind = run, kind

    def patterns(self) -> tuple[str, ...]:
        """The bus patterns this handler listened on."""
        return tuple(self.kind.patterns(self.handler.hooks))

    def hears(self, logged, record) -> bool:
        """Whether the bus would have given the handler this event: a pattern it listened on, and its feature on."""
        return bool(set(bus.patterns(logged)) & set(self.patterns())) and self.feature.enabled(record)

    def handle(self, event: OldEvent, record) -> list[Fact]:
        """Runs the bus's own run of the handler, so the adapter holds no second way to read the event or build the Context."""
        return ran_on_the_bus(self, event, record)


def adapted_beside_the_bus(feature, handler: OldStyle, run, kind) -> None:
    """Registers an old handler on the adapter too, once. Nothing dispatches an OldEvent yet, so it runs nothing."""
    try:
        receiver = LoggedHandler(feature, handler, run, kind)
    except CannotBeAdapted as refusal:
        NOT_ADAPTABLE[feature.name, type(handler).__name__] = str(refusal)
        return
    TICKING.let_go(run)
    ADAPTED.add(Registration.read(HANDLE, OldEvent, receiver, (), feature.name))
    TICKING.resolve()


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


SLOTS = (bus.ANY, "type", "action", "type.action", "event", "hook", "hook.*")
"""The order bus.patterns puts an event's patterns in, which is the order the bus runs their listeners in: the widest first. A pattern belongs to one slot whatever the event, so the place a listener runs in is known once, at seating, and the lane keeps the order the bus had."""


def slot_of(pattern: str) -> int:
    """Which of bus.patterns' places this pattern is matched in."""
    if pattern == bus.ANY:
        return 0
    if pattern == "hook.*":
        return 6
    if pattern.startswith("hook."):
        return 5
    if "." in pattern:
        return 3
    if pattern in ACTIONS:
        return 2
    if pattern in TYPES:
        return 1
    return 4


class BusListener(Handler[Fact]):
    """A listener registered straight on the bus, rather than by a feature's wiring: the engine's own, such as the switch cache. It runs on the lane like an old handler, so the lane carries everything the bus carried."""

    adapted = True

    def __init__(self, listener, pattern: str, enabled):
        self.listener, self.pattern, self.enabled = listener, pattern, enabled

    def called(self) -> str:
        return f"{getattr(self.listener, '__qualname__', type(self.listener).__name__)}:{self.pattern}"

    @classmethod
    def wants(cls) -> dict[str, type]:
        return {"record": TheRecord}

    def patterns(self) -> tuple[str, ...]:
        return (self.pattern,)

    def hears(self, logged, record) -> bool:
        return self.pattern in bus.patterns(logged) and self.enabled(record)

    def handle(self, event: "OldEvent", record) -> list[Fact]:
        return ran_on_the_bus(self, event, record)


class CatalogueFacts(Listener[Fact]):
    """A logged event as the catalogue names it, once for each typed event a swept feature registered on: what carries the bus's string patterns over to the 3.0 engine's types."""

    adapted = True

    def __init__(self, moved: Registrations):
        self.moved = moved

    def called(self) -> str:
        return "CatalogueFacts"

    def patterns(self) -> tuple[str, ...]:
        """No pattern: every logged event is read for the catalogue facts it is."""
        return ()

    @classmethod
    def wants(cls) -> dict[str, type]:
        return {}

    def listen(self, event: "OldEvent") -> list[Fact]:
        patterns = set(bus.patterns(event.logged))
        kinds = dict.fromkeys(one.event for one in self.moved.each if issubclass(one.event, TypedEvent) and patterns & set(one.event.patterns(())))
        return [typed for kind in kinds if (typed := kind.read(event.logged)).wanted() and not (isinstance(typed, AgentEvent) and not typed.agent)]


class FailedTick(Handler[Fact]):
    """A tick that raised: the handlers' writes are rolled back and this says so, where the 2.x bus let the raise out into the write that told the event."""

    adapted = True

    def called(self) -> str:
        return "FailedTick"

    def patterns(self) -> tuple[str, ...]:
        """None: it hears a fact of the engine's own, not a logged event."""
        return ()

    @classmethod
    def wants(cls) -> dict[str, type]:
        return {"record": TheRecord}

    def handle(self, event, record) -> list[Fact]:
        tell(record, f"A tick on {event.failed} failed", event.error)
        return []


def patterns_of(receiver) -> tuple:
    """The bus patterns a receiver answers to, and none for a receiver written for the 3.0 engine, which answers to a type instead."""
    return receiver.patterns() if hasattr(receiver, "patterns") else ()


class Ticking:
    """One told event as a tick of the project lane, over the receivers the bus walked and in its order."""

    def __init__(self, registered: Registrations, moved: Registrations):
        self.registered = registered
        self.moved = moved
        """The registrations the features wrote for the 3.0 engine. They stay a registry of their own, because the adapted ones are exempt by name from the boot walk's rules and these are not."""
        self.running = Registrations()
        self.order = InOrder({})

    def resolve(self) -> None:
        """Works the order out again, after a receiver has joined or left: the widest patterns first, as the bus ran them, and the moved features' own receivers after them."""
        self.registered.add(Registration.read(HANDLE, TickFailed, FailedTick(), ()))
        self.registered.add(Registration.read(LISTEN, OldEvent, CatalogueFacts(self.moved), ()))
        self.registered.each.sort(key=lambda one: min((slot_of(pattern) for pattern in patterns_of(one.receiver)), default=4))
        self.running = Registrations()
        for one in (*self.registered.each, *self.moved.each):
            self.running.add(one)
        self.order = InOrder.of(self.running)

    def already_runs(self, listener) -> bool:
        return any(getattr(one.receiver, "listener", None) is listener for one in self.registered.of(HANDLE))

    def join(self, pattern: str, listener, enabled) -> None:
        """A listener the bus has taken runs on the lane too, unless a feature's wiring already put it there as an old handler."""
        if self.already_runs(listener):
            return
        self.registered.add(Registration.read(HANDLE, OldEvent, BusListener(listener, pattern, enabled), ()))
        self.resolve()

    def leave(self, pattern: str, listener) -> None:
        one = next((one for one in self.registered.of(HANDLE) if getattr(one.receiver, "listener", None) is listener and getattr(one.receiver, "pattern", "") == pattern), None)
        if one is not None:
            self.registered.forget(HANDLE, one.feature, one.name)

    def let_go(self, listener) -> None:
        """A listener the bus took before its feature's wiring reached the adapter: the old handler replaces it, so it is not run twice."""
        for one in [one for one in self.registered.of(HANDLE) if getattr(one.receiver, "listener", None) is listener]:
            self.registered.forget(HANDLE, one.feature, one.name)

    def reaches(self, logged, record) -> None:
        """An event with no record of its own cannot be a tick, since a handler is run against one: it keeps the walk."""
        if record is None:
            bus.over_the_listeners(logged, record)
            return
        self.lane(f"project:{logged.id}", record, lambda: agent_of(logged, record)).run(OldEvent(logged=logged))

    def lane(self, name: str, record, agent) -> Lane:
        """A lane over this record, about this agent, with every receiver the features registered."""
        return Lane(name, self.running, Services(lane_services(record, agent)), Claims(record.state("claims")), order=self.order, record=record,
                    switched_on=lambda feature: not feature or FEATURES[feature].enabled(record),
                    is_due=lambda feature, fact: due_now(FEATURES[feature], record, fact),
                    held_back=lambda fact: self.held_back(fact, record),
                    watch=lambda one, fact, began: watched(Promise.of(one), fact, record, began) if not type(one.receiver).adapted else None)

    def held_back(self, fact: Fact, record) -> bool:
        """Holds a spaced fact until its span is up, then runs the newest held on a lane of its own over a fresh read of the record."""
        key, seconds = fact.spacing
        root, env = record.root, record.env
        bus.spaced(f"{root}|{env}|{key}", seconds, lambda: self.later(replace(fact, spacing=()), Record(root, env, memo=True)))
        return True

    def later(self, fact: Fact, record) -> None:
        self.lane(f"spaced:{type(fact).__name__}", record, lambda: agent_of_fact(fact, record)).run(fact)


def watched(promise, event, record, began: float) -> None:
    """Where the journal develops itself, a handler's run is noted for the watch, which looks at it elsewhere and on its own time; a run with no record is not watched."""
    if record is not None and developing(record.root.parent):
        WATCH.ran(promise, event, record, began)


TICKING = Ticking(ADAPTED, REGISTERED)
"""The one lane every receiver runs on, adapted or moved."""


class HalfSwept(Exception):
    """A feature registering for both engines at once, which the boot refuses rather than let every handler of it fire twice."""

    @classmethod
    def of(cls, feature: str, adapted: list[str], moved: list[str]) -> "HalfSwept":
        return cls(f"{feature} registers {', '.join(sorted(adapted))} on the 2.x bus and {', '.join(sorted(moved))} on the 3.0 engine; "
                   "a feature is swept whole or not at all, because both run on the same lane and every handler of it would fire twice")


def no_feature_is_half_swept() -> None:
    """Refuses a feature that registers for both engines. There is no skip to write: a swept feature registers no 2.x handler, so the only way to run twice is to register twice."""
    adapted = [one for one in ADAPTED.each if one.feature and one.name not in THE_ENGINES_OWN]
    moved = [one for one in REGISTERED.each if one.feature and one.name not in THE_ENGINES_OWN]
    for feature in sorted({one.feature for one in adapted} & {one.feature for one in moved}):
        raise HalfSwept.of(feature, [one.name for one in adapted if one.feature == feature],
                           [one.name for one in moved if one.feature == feature])


def ordered_once_the_features_have_registered() -> None:
    """Works the lane's order out again once every feature has registered, since a feature written for the 3.0 engine registers after the lane is wired and calls nothing that would resolve it. A moved receiver that asks for what the lane does not serve is refused here, at boot."""
    no_feature_is_half_swept()
    walked(REGISTERED, set(lane_services(None, lambda: None)))
    TICKING.resolve()


def dispatched_on_a_lane() -> None:
    """From here on a told event is a tick, never a walk over the listeners. Called once, when the features are seated."""
    TICKING.resolve()
    bus.dispatched_by(TICKING.reaches, TICKING.join, TICKING.leave)


def requests_answered() -> None:
    """From here a request is answered by the features' refusers and answerers, in every process: a command's write is refused where it is made."""
    bus.answered_by(lambda request, record: answering(REGISTERED, request, record))
