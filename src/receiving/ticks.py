"""A tick: listeners read, handlers write, and what either of them dispatched runs on the next tick.

A tick belongs to a lane - one per session, one for the project - and ticks of one lane run in arrival
order. Nothing runs inline, so a listener never sees a write that its own fact caused, and a handler
never runs inside the hook that started it.
"""

import time
from contextvars import ContextVar
from collections.abc import Callable
from contextlib import contextmanager
from dataclasses import dataclass, field

from engine import bus
from events import Event, Fact
from receiving import LISTEN, Registrations
from receiving.ordering import InOrder

MOST_TICKS = 32


class TooManyTicks(RuntimeError):
    @classmethod
    def of(cls, chain: list[str]) -> "TooManyTicks":
        return cls(f"a lane ran {MOST_TICKS} ticks without emptying, so something it dispatches causes itself: {' caused '.join(chain)}")


IN_HAND: ContextVar = ContextVar("in_hand", default=None)
"""The fact the lane's handlers are acting on now, so a service about an agent speaks to the agent that fact names."""


class Unserved(LookupError):
    """A service the receiver asked for has nobody to answer for at this moment, such as a chat with no agent in the environment: the receiver has nothing to act on and is passed over."""


class NoSuchService(LookupError):
    @classmethod
    def of(cls, receiver: str, name: str, asked) -> "NoSuchService":
        return cls(f"{receiver} asks for {name}, which no service answers; the engine resolves every service at boot and hands it the thing itself")


@dataclass(frozen=True, kw_only=True)
class TickFailed(Fact):
    """A handler raised, so its tick was rolled back and nothing it wrote stands. The activity list shows it and the diagnostics log keeps it."""

    failed: str
    error: str


class PerAsk:
    """A service answered anew for each ask, by the feature asking and the exact type it asked for: a chat that speaks as that feature, the controller of the Rows[Todo] it named."""

    def __init__(self, each: Callable[[str, object], object]):
        self.each = each

    def of(self, feature: str, asked):
        return self.each(feature, asked)


class Services:
    """Every service a receiver may ask for, resolved once at boot. A miss raises here rather than handing back None."""

    def __init__(self, answering: dict[type, object]):
        self.answering = answering

    def given(self, receiver: str, feature: str, wants: dict[str, object]) -> dict:
        """What one receiver asked for, each answered; a service answered per ask is asked with the receiver's feature and the type it named."""
        found = {}
        for name, asked in wants.items():
            service = getattr(asked, "__origin__", asked)
            if service not in self.answering:
                raise NoSuchService.of(receiver, name, asked)
            answers = self.answering[service]
            found[name] = answers.of(feature, asked) if isinstance(answers, PerAsk) else answers
        return found


class NothingHeld:
    """A lane with no record of its own, as a lane under test has: there is nothing to hold, so a tick runs as it is."""

    @contextmanager
    def snapshot(self):
        yield None


KEPT_CLAIMS = 1000
"""How many once-claims are remembered, the number the 2.x once() kept; a span claimed by every is kept apart, one per key, so a busy span never pushes a once-claim out."""


class Remembered:
    """Claims held only for the life of a process, for a lane under test. Nothing durable is wanted there, and nothing is."""

    def __init__(self):
        self.taken: dict = {}

    def claim(self, key: str, value, keep: int = 0) -> bool:
        if key in self.taken:
            return False
        self.taken[key] = value
        return True

    def advance(self, key: str, step) -> bool:
        if self.taken.get(key) == step:
            return False
        self.taken[key] = step
        return True


@dataclass
class Claims:
    """What the engine has claimed for a lane, kept in a store so a restart does not hand a held turn out again."""

    held: object = field(default_factory=Remembered)
    spans: object = field(default_factory=Remembered)

    def take(self, key: str, at: float = 0.0) -> bool:
        return self.held.claim(key, at or time.time(), keep=KEPT_CLAIMS)

    def take_span(self, key: str, span: int) -> bool:
        """Whether this span of the key is yet to be taken, taking it: the span a fact dispatched with every goes in, once."""
        return self.spans.advance(key, span)


@dataclass
class Lane:
    """One line of ticks. What a tick dispatches is the next tick's queue, and the lane runs until it empties."""

    name: str
    registered: Registrations
    services: Services
    claims: "Claims" = field(default_factory=lambda: Claims())
    order: InOrder = field(default_factory=lambda: InOrder({}))
    record: object = field(default_factory=NothingHeld)
    switched_on: Callable[[str], bool] = lambda feature: True
    """Whether a feature is on for this lane's record: a receiver of a feature switched off is not run."""
    is_due: Callable[[str, Fact], bool] = lambda feature, fact: True
    """Whether a fact a listener of this feature dispatched with due is due now: the engine counts the moment and asks the feature's trigger."""
    held_back: Callable[[Fact], bool] = lambda fact: False
    """Holds a fact dispatched with spaced until its span is up, and says whether it took it, so the lane does not run it now."""
    watch: Callable[[object, Event, float], None] = lambda registration, fact, began: None
    """Notes a handler's run for the runtime watch of its expectations, with when it began."""
    ran: list = field(default_factory=list)
    dropped: list = field(default_factory=list)

    def named(self, event: Event, causing: Event) -> Event:
        return event.caused_by(causing, f"{self.name}:{len(self.ran)}:{type(event).__name__}")

    def dispatched(self, events: list[Event]) -> list[Event]:
        """The events that go on. One carrying a claim goes only if it takes it, so a listener never claims for itself and a handler never asks whether it already ran."""
        going = []
        for event in events:
            if getattr(event, "claim", "") and not self.claims.take(event.claim):
                self.dropped.append(event)
                continue
            if getattr(event, "window", ()) and not self.claims.take_span(*event.window):
                self.dropped.append(event)
                continue
            if getattr(event, "spacing", ()) and self.held_back(event):
                continue
            going.append(event)
        return going

    def run(self, event: Event) -> list[Event]:
        """Runs the event and everything it causes, tick by tick, until the lane empties or the cap bites."""
        queued, chain = self.dispatched([self.named(event, event)]), [type(event).__name__]
        while queued:
            if len(self.ran) >= MOST_TICKS:
                raise TooManyTicks.of(chain)
            self.ran.append(tuple(queued))
            with self.record.snapshot():
                queued = self.dispatched(self.tick(queued))
            chain.extend(sorted({type(fact).__name__ for fact in queued}))
        return [one for tick in self.ran for one in tick]

    def tick(self, queued: list[Event]) -> list[Event]:
        """One tick: the listeners read, then the handlers write inside one transaction. What either dispatched waits for the next tick."""
        heard = [self.named(fact, event) for event in queued for fact in self.recognised(event)]
        return heard + self.handled([event for event in queued if isinstance(event, Fact)])

    def recognised(self, event: Event) -> list[Fact]:
        """What the listeners of this event recognised. They read and write nothing, so they need no transaction."""
        return [fact for one in self.registered.of(LISTEN) if one.event is type(event) and self.switched_on(one.feature)
                for fact in one.receiver.listen(event, **self.services.given(one.name, one.feature, type(one.receiver).wants()))
                if not fact.trigger or self.is_due(one.feature, fact)]

    def handled(self, facts: list[Fact]) -> list[Event]:
        """What the handlers of these facts did, inside one transaction: a raise rolls the whole tick back and leaves a TickFailed in its place."""
        dispatched: list[Event] = []
        for fact in facts:
            held = IN_HAND.set(fact)
            try:
                with bus.unit(), bus.causing(fact.id):
                    for one in self.order.handlers(type(fact), self.registered):
                        if not self.switched_on(one.feature):
                            continue
                        try:
                            given = self.services.given(one.name, one.feature, type(one.receiver).wants())
                        except Unserved:
                            continue
                        began = time.time()
                        for caused in one.receiver.handle(fact, **given):
                            dispatched.append(self.named(caused, fact))
                        self.watch(one, fact, began)
            except Exception as raised:
                dispatched = [one for one in dispatched if one.cause != fact.id]
                if isinstance(fact, TickFailed):
                    raise
                dispatched.append(self.named(TickFailed(failed=type(fact).__name__, error=str(raised)), fact))
            finally:
                IN_HAND.reset(held)
        return dispatched
