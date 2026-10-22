from dataclasses import dataclass

from journal.events.event import Event


@dataclass(frozen=True, kw_only=True)
class JournalUpdated(Event):
    """The journal started on a version other than the one it last started on: an update or an install has landed."""

    previous: str
    current: str

    @property
    def key(self) -> str:
        return "journal.updated"
