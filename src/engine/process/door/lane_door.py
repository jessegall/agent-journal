from collections.abc import Callable
from contextlib import AbstractContextManager, nullcontext
from functools import cache

from engine.journal.journal_home import JournalHome
from engine.process.door.placed_run import PlacedRun


class LaneDoor:
    """The lanes a server installs for the journal it serves, which give a run of the journal's own its ticket; a
    journal no server serves in this process has none, and its runs never wait."""

    def __init__(self) -> None:
        self.admit: Callable[[PlacedRun], AbstractContextManager[None]] | None = None

    # one door for each journal a process serves, shared by every thread
    @staticmethod
    @cache
    def shared(home: JournalHome) -> "LaneDoor":
        return LaneDoor()

    def install(self, admit: Callable[[PlacedRun], AbstractContextManager[None]]) -> None:
        self.admit = admit

    def remove(self) -> None:
        self.admit = None

    def admitted(self, run: PlacedRun) -> AbstractContextManager[None]:
        return self.admit(run) if self.admit is not None else nullcontext()
