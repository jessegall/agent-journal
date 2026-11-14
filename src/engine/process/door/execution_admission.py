from contextlib import AbstractContextManager

from engine.journal.journal_home import JournalHome
from engine.process.door.lane_door import LaneDoor
from engine.process.door.placed_run import PlacedRun


class ExecutionAdmission:
    """Gives a run of the journal's own its ticket for as long as it runs, through the lanes the server installed;
    an install or the CLI with no server running has none, so its runs never wait."""

    def __init__(self, home: JournalHome) -> None:
        self.home = home

    def admitted(self, run: PlacedRun) -> AbstractContextManager[None]:
        return LaneDoor.shared(self.home).admitted(run)
