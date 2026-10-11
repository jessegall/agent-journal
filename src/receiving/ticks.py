"""A tick: listeners read, handlers write, and what either of them dispatched runs on the next tick.

A tick belongs to a lane - one per session, one for the project - and ticks of one lane run in arrival
order. Nothing runs inline, so a listener never sees a write that its own fact caused, and a handler
never runs inside the hook that started it.
"""

from contextlib import contextmanager
from dataclasses import dataclass, field, replace

from engine import bus
from events import Event, Fact
from receiving import ANSWER, HANDLE, LISTEN, Registrations
from receiving.ordering import ordered
from serving import Service

MOST_TICKS = 32


class TooManyTicks(RuntimeError):
    @classmethod
    def of(cls, chain: list[str]) -> "TooManyTicks":
        return cls(f"a lane ran {MOST_TICKS} ticks without emptying, so something it dispatches causes itself: {' caused '.join(chain)}")


class NoSuchService(LookupError):
    @classmethod
    def of(cls, receiver: str, name: str, asked) -> "NoSuchService":
        return cls(f"{receiver} asks for {name}, which no service answers; the engine resolves every service at boot and hands it the thing itself")


@dataclass(frozen=True, kw_only=True)
class TickFailed(Fact):
    """A handler raised, so its tick was rolled back and nothing it wrote stands. The activity list shows it and the diagnostics log keeps it."""

    failed: str
    error: str


class Services:
    """Every service a receiver may ask for, resolved once at boot. A miss raises here rather than handing back None."""

    def __init__(self, answering: dict[type, object]):
        self.answering = answering

    def given(self, receiver: str, wants: dict[str, object]) -> dict:
        found = {}
        for name, asked in wants.items():
            service = getattr(asked, "__origin__", asked)
            if service not in self.answering:
                raise NoSuchService.of(receiver, name, asked)
            found[name] = self.answering[service]
        return found


class NothingHeld:
    """A lane with no record of its own, as a lane under test has: there is nothing to hold, so a tick runs as it is."""

    @contextmanager
    def snapshot(self):
        yield None


@dataclass
class Claims:
    """What the engine has already claimed for a lane. A fact carrying a claim is dispatched by whoever takes it and by nobody after, so the same turn read three ways is handled once."""

    taken: dict = field(default_factory=dict)

    def take(self, key: str, at: float = 0.0) -> bool:
        if key in self.taken:
            return False
        self.taken[key] = at
        return True


@dataclass
class Lane:
    """One line of ticks. What a tick dispatches is the next tick's queue, and the lane runs until it empties."""

    name: str
    registered: Registrations
    services: Services
    claims: "Claims" = field(default_factory=lambda: Claims())
    record: object = field(default_factory=NothingHeld)
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
        return [fact for one in self.registered.of(LISTEN) if one.event is type(event)
                for fact in one.receiver.listen(event, **self.services.given(one.name, type(one.receiver).wants()))]

    def handled(self, facts: list[Fact]) -> list[Event]:
        """What the handlers of these facts did, inside one transaction: a raise rolls the whole tick back and leaves a TickFailed in its place."""
        dispatched: list[Event] = []
        for fact in facts:
            try:
                with bus.unit():
                    for one in ordered(type(fact), [r for r in self.registered.of(HANDLE) if r.event is type(fact)]):
                        for caused in one.receiver.handle(fact, **self.services.given(one.name, type(one.receiver).wants())):
                            dispatched.append(self.named(caused, fact))
            except Exception as raised:
                dispatched = [one for one in dispatched if one.cause != fact.id]
                dispatched.append(self.named(TickFailed(failed=type(fact).__name__, error=str(raised)), fact))
        return dispatched
