from core.base.change.event_pattern import ALTERNATIVE, ANY
from core.base.registry.guard_entry import GuardEntry
from core.base.registry.listener_entry import ListenerEntry
from core.base.registry.listener_timing import ListenerTiming


class EventLookup:
    """The guards and listeners of each event name, in order, kept in memory: every name a class declares is scanned
    when the registry loads, and each change is one dictionary read. A name no class declares by itself is kept
    the first time it is seen."""

    def __init__(self, guards: tuple[GuardEntry, ...], listeners: tuple[ListenerEntry, ...]) -> None:
        self.guards, self.listeners = guards, listeners
        self.event_guards: dict[str, tuple[GuardEntry, ...]] = {}
        self.event_listeners: dict[tuple[str, ListenerTiming], tuple[ListenerEntry, ...]] = {}
        for event in self.declared_events():
            self.guards_of(event)
            for timing in ListenerTiming:
                self.listeners_of(event, timing)

    def declared_events(self) -> set[str]:
        patterns = (alternative for entry in (*self.guards, *self.listeners) for alternative in entry.event.text.split(ALTERNATIVE))
        return {pattern for pattern in patterns if ANY not in pattern}

    def guards_of(self, event: str) -> tuple[GuardEntry, ...]:
        if event not in self.event_guards:
            self.event_guards[event] = tuple(sorted((guard for guard in self.guards if guard.event.matches(event)), key=lambda guard: guard.position))
        return self.event_guards[event]

    def listeners_of(self, event: str, timing: ListenerTiming) -> tuple[ListenerEntry, ...]:
        key = (event, timing)
        if key not in self.event_listeners:
            matching = (listener for listener in self.listeners if listener.timing is timing and listener.event.matches(event))
            self.event_listeners[key] = tuple(sorted(matching, key=lambda listener: listener.position))
        return self.event_listeners[key]
