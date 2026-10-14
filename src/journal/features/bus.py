from typing import Generic, TypeVar

from journal.hooks.decision import Decision
from journal.models.event import Event

E = TypeVar("E", bound=Event)


class Listener(Generic[E]):
    """Hears one kind of event and may add to the decision."""

    kind: str

    def hear(self, event: E, decision: Decision) -> Decision: ...


class Bus:
    def __init__(self) -> None: ...

    def listen(self, listener: Listener) -> None: ...

    def tell(self, event: Event) -> Decision: ...
