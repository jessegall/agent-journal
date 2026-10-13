"""Carries a logged event onto the 3.0 engine's lane: the engine's own bus listeners and the catalogue facts the features registered on."""

from pathlib import Path
from dataclasses import dataclass, replace

from engine import bus
from engine.record import Record
from events import Fact
from events.typed import AgentEvent, TypedEvent
from engine.developing import developing
from expects.watching import WATCH, tell
from framework.loaded import FEATURES
from framework.lanes import agent_of, agent_of_fact, answering, due_now, lane_services
from framework.promises import Promise
from receiving import HANDLE, LISTEN, REGISTERED, Handler, Listener, Registration, Registrations
from receiving.boot import walked
from receiving.imports import walked as walked_imports
from receiving.ordering import InOrder
from receiving.ticks import Claims, Lane, Services, TickFailed
from resources.base import ACTIONS
from resources.types import TYPES
from serving import Adapted as TheRecord

ADAPTED = Registrations()
"""The engine's own receivers of a logged event, the bus listeners and the catalogue facts, kept apart from the features' registry so the boot walk's rules for a feature do not bind them."""

def ran_on_the_bus(receiver, event: "LoggedEvent", record) -> list[Fact]:
    """What a receiver of the lane does in place of the bus: hands the logged event to what the bus would have run, if this one would have heard it. It dispatches nothing: whatever the listener wrote reaches the engine as the funnel's own resource facts."""
    if receiver.hears(event.logged, record):
        receiver.listener(event.logged, record)
    return []


@dataclass(frozen=True, kw_only=True)
class LoggedEvent(Fact):
    """A bridge: a logged event wrapped so the lane can carry it to the old handlers. The row that removes the adapter removes this class."""

    logged: object


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

    carrier = True

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

    def handle(self, event: "LoggedEvent", record) -> list[Fact]:
        return ran_on_the_bus(self, event, record)


class CatalogueFacts(Listener[Fact]):
    """A logged event as the catalogue names it, once for each typed event a swept feature registered on: what carries the bus's string patterns over to the 3.0 engine's types."""

    carrier = True

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

    def listen(self, event: "LoggedEvent") -> list[Fact]:
        patterns = set(bus.patterns(event.logged))
        kinds = dict.fromkeys(one.event for one in self.moved.each if issubclass(one.event, TypedEvent) and patterns & set(one.event.patterns(())))
        return [typed for kind in kinds if (typed := kind.read(event.logged)).wanted() and not (isinstance(typed, AgentEvent) and not typed.agent)]


class FailedTick(Handler[Fact]):
    """A tick that raised: the handlers' writes are rolled back and this says so, where the 2.x bus let the raise out into the write that told the event."""

    carrier = True

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
        """The registrations the features wrote. They stay a registry of their own, because the engine's carriers are exempt from the boot walk's rules and these are not."""
        self.running = Registrations()
        self.order = InOrder({})

    def resolve(self) -> None:
        """Works the order out again, after a receiver has joined or left: the widest patterns first, as the bus ran them, and the moved features' own receivers after them."""
        self.registered.add(Registration.read(HANDLE, TickFailed, FailedTick(), ()))
        self.registered.add(Registration.read(LISTEN, LoggedEvent, CatalogueFacts(self.moved), ()))
        self.registered.sort(key=lambda one: min((slot_of(pattern) for pattern in patterns_of(one.receiver)), default=4))
        running = Registrations()
        for one in (*self.registered.each, *self.moved.each):
            running.add(one)
        order = InOrder.of(running)
        self.running, self.order = running, order

    def hears(self, pattern: str) -> bool:
        """Whether a feature written for the 3.0 engine receives the typed event that this pattern names."""
        return any(issubclass(one.event, TypedEvent) and pattern in one.event.patterns(()) for one in self.moved.each)

    def join(self, pattern: str, listener, enabled) -> None:
        """A listener the bus has taken runs on the lane too."""
        self.registered.add(Registration.read(HANDLE, LoggedEvent, BusListener(listener, pattern, enabled), ()))
        self.resolve()

    def leave(self, pattern: str, listener) -> None:
        one = next((one for one in self.registered.of(HANDLE) if getattr(one.receiver, "listener", None) is listener and getattr(one.receiver, "pattern", "") == pattern), None)
        if one is not None:
            self.registered.forget(HANDLE, one.feature, one.name)

    def reaches(self, logged, record) -> None:
        """An event with no record of its own cannot be a tick, since a handler is run against one: it keeps the walk."""
        if record is None:
            bus.over_the_listeners(logged, record)
            return
        self.lane(f"project:{logged.id}", record, lambda: agent_of(logged, record)).run(LoggedEvent(logged=logged))

    def lane(self, name: str, record, agent) -> Lane:
        """A lane over this record, about this agent, with every receiver the features registered."""
        return Lane(name, self.running, Services(lane_services(record, agent)), Claims(record.state("claims")), order=self.order, record=record,
                    switched_on=lambda feature: not feature or FEATURES[feature].enabled(record),
                    is_due=lambda feature, fact: due_now(FEATURES[feature], record, fact),
                    held_back=lambda fact: self.held_back(fact, record),
                    watch=lambda one, fact, began: watched(Promise.of(one), fact, record, began) if not type(one.receiver).carrier else None)

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
"""The one lane every receiver runs on, the engine's own and the features'."""


def ordered_once_the_features_have_registered() -> None:
    """Works the lane's order out again once every feature has registered, since a feature written for the 3.0 engine registers after the lane is wired and calls nothing that would resolve it. A moved receiver that asks for what the lane does not serve is refused here, at boot."""
    walked(REGISTERED, set(lane_services(None, lambda: None)))
    TICKING.resolve()


def no_feature_reaches_outside() -> None:
    """Refuses, once at the server's boot, a feature that names a package outside what a feature may. It walks the source where the journal runs from its folder; an installed build runs from its archive, which was walked before it was released."""
    source = Path(__file__).resolve().parents[1]
    if not source.is_dir():
        return
    walked_imports(source, refusing=True)


def dispatched_on_a_lane() -> None:
    """From here on a told event is a tick, never a walk over the listeners. Called once, when the features are seated."""
    TICKING.resolve()
    bus.dispatched_by(TICKING.reaches, TICKING.join, TICKING.leave, TICKING.hears)


def requests_answered() -> None:
    """From here a request is answered by the features' refusers and answerers, in every process: a command's write is refused where it is made."""
    bus.answered_by(lambda request, record: answering(REGISTERED, request, record))
