from journal.events.event import Event
from journal.features.listener import Listener


class Bus:
    def __init__(self) -> None:
        self._listeners: list[tuple[type[Event], Listener]] = []

    def listen(self, kind: type[Event], listener: Listener) -> None:
        self._listeners.append((kind, listener))

    def listeners(self, kind: type[Event]) -> list[Listener]:
        """In registration order, those registered for this class or a base of it: a feature's place in the order is its listeners' place, whether they listen on the class or on a base."""
        bases = set(kind.__mro__)
        return [listener for registered, listener in self._listeners if registered in bases]

    def dispatch(self, event: Event) -> list[object]:
        """Every listener of this kind, in registration order; their answers, in that order. A listener that raises stops the rest."""
        return [listener.handle(event) for listener in self.listeners(type(event))]
