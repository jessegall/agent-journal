from collections import defaultdict

from journal.events.event import Event
from journal.features.listener import Listener


class Bus:
    def __init__(self) -> None:
        self._listeners: dict[type[Event], list[Listener]] = defaultdict(list)

    def listen(self, kind: type[Event], listener: Listener) -> None:
        self._listeners[kind].append(listener)

    def listeners(self, kind: type[Event]) -> list[Listener]:
        """In registration order, those registered for this class or a base of it."""
        return [listener for base in kind.__mro__ for listener in self._listeners.get(base, ())]

    def dispatch(self, event: Event) -> list[object]:
        """Every listener of this kind, in registration order; their answers, in that order. A listener that raises stops the rest."""
        return [listener.handle(event) for listener in self.listeners(type(event))]
