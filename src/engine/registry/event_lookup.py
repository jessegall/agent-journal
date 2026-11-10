from engine.change.event_pattern import ALTERNATIVE, ANY
from engine.registry.guard_entry import GuardEntry
from engine.registry.listener_entry import ListenerEntry
from engine.registry.listener_timing import ListenerTiming
from engine.registry.unscanned_event_error import UnscannedEventError


class EventLookup:
    """Guards and listeners indexed by event name and timing when the registry loads."""

    def __init__(self, guards: tuple[GuardEntry, ...], listeners: tuple[ListenerEntry, ...], events: tuple[str, ...]) -> None:
        self.guards, self.listeners, self.events = guards, listeners, events
        self.event_guards: dict[str, tuple[GuardEntry, ...]] = {}
        self.event_listeners: dict[tuple[str, ListenerTiming], tuple[ListenerEntry, ...]] = {}
        for event in {*events, *self.declared_events()}:
            self.scan(event)

    def scan(self, event: str) -> None:
        self.event_guards[event] = tuple(sorted((guard for guard in self.guards if guard.event.matches(event)), key=lambda guard: guard.position))
        for timing in ListenerTiming:
            matching = (listener for listener in self.listeners if listener.timing is timing and listener.event.matches(event))
            self.event_listeners[(event, timing)] = tuple(sorted(matching, key=lambda listener: listener.position))

    def matching_guards(self, event: str) -> tuple[GuardEntry, ...]:
        if event not in self.event_guards:
            self.refuse_unscanned(event)
            self.scan(event)
        return self.event_guards[event]

    def matching_listeners(self, event: str, timing: ListenerTiming) -> tuple[ListenerEntry, ...]:
        if (event, timing) not in self.event_listeners:
            self.refuse_unscanned(event)
            self.scan(event)
        return self.event_listeners[(event, timing)]

    def refuse_unscanned(self, event: str) -> None:
        if self.events:
            raise UnscannedEventError(f"{event} was not scanned when the registry loaded: every event is known at sync")

    def declared_events(self) -> set[str]:
        patterns = (alternative for entry in (*self.guards, *self.listeners) for alternative in entry.event.text.split(ALTERNATIVE))
        return {pattern for pattern in patterns if ANY not in pattern}
