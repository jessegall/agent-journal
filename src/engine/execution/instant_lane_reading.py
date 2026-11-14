from collections.abc import Callable, Mapping, Sequence
from functools import cache

from engine.journal.journal_home import JournalHome

InstantEntries = Callable[[], Sequence[Mapping[str, object]]]


class InstantLaneReading:
    """What runs and waits in the instant lane, which lives in the server's memory: the server installs a reader for
    the journal it serves; a process no server runs in reads the lane as empty."""

    def __init__(self) -> None:
        self.read: InstantEntries | None = None
        self.capacity = 0

    # one reading for each journal a process serves
    @staticmethod
    @cache
    def shared(home: JournalHome) -> "InstantLaneReading":
        return InstantLaneReading()

    def install(self, read: InstantEntries, capacity: int) -> None:
        self.read, self.capacity = read, capacity

    def remove(self) -> None:
        self.read, self.capacity = None, 0

    def entries(self) -> Sequence[Mapping[str, object]]:
        return self.read() if self.read is not None else ()
