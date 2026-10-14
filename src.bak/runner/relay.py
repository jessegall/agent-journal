from typing import Iterator

from engine.record import Record
from resources.base import Event

KEPT = "relay"


class Relay:
    """The events of a record the server has yet to take, from the last one it took: the place is kept across restarts, so what a process without listeners wrote while the server was down is taken when it comes up."""

    def __init__(self, record: Record):
        self.record = record
        self.cursor: int | None = None

    def each(self) -> Iterator[Event]:
        state = self.record.state(KEPT)
        if self.cursor is None:
            kept = state.get("id")
            self.cursor = kept if isinstance(kept, int) else self.record.event_log.last_id()
            if kept != self.cursor:
                state.set("id", self.cursor)
        began = self.cursor
        try:
            for event in self.record.event_log.events(self.cursor):
                self.cursor = event.id
                yield event
        finally:
            if self.cursor != began:
                state.set("id", self.cursor)
