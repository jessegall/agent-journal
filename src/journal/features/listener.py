from typing import Generic, TypeVar

from journal.events.event import Event

E = TypeVar("E", bound=Event)


class Listener(Generic[E]):
    """Hears one kind of event. Returns what it has to say, or nothing."""

    def handle(self, event: E) -> object: ...
