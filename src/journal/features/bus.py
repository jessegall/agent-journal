from journal.events.event import Event
from journal.features.listener import Listener


class Bus:
    def __init__(self) -> None: ...

    def listen(self, kind: type[Event], listener: Listener) -> None: ...

    def listeners(self, kind: type[Event]) -> list[Listener]:
        """In registration order."""
        ...

    def dispatch(self, event: Event) -> list[object]:
        """Every listener of this kind, in registration order; their answers, in that order."""
        ...
