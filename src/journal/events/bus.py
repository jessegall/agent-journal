from journal.events.event import Event
from journal.events.listener import Listener


class Bus:
    def __init__(self) -> None:
        self._listeners: list[tuple[type[Event], Listener]] = []

    def listen(self, kind: type[Event], listener: Listener) -> None:
        self._listeners.append((kind, listener))

    def listeners(self, kind: type[Event]) -> list[Listener]:
        bases = set(kind.__mro__)
        return [listener for registered, listener in self._listeners if registered in bases]

    def dispatch(self, event: Event) -> list[object]:
        return [listener.handle(event) for listener in self.listeners(type(event))]
