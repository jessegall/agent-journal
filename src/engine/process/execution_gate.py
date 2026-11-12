from engine.journal.journal_home import JournalHome
from engine.process.placed_run import PlacedRun
from engine.process.run_placement import RunPlacement
from engine.serving.server_files import ServerFiles
from engine.time.polled_wait import PolledWait

PAUSE_LIMIT_SECONDS = 600
PAUSE_LOOK_SECONDS = 0.5


class ExecutionGate:
    """Holds the door while the server starts or updates, or while the agent the run works for is paused: a run waits,
    as its row in the queue, until the server is ready and the agent resumed, and goes on after the safety limit so a
    lost update or a forgotten pause never holds the journal for good."""

    def __init__(self, home: JournalHome) -> None:
        self.home = home

    def opened(self, placement: RunPlacement, run: PlacedRun) -> bool:
        files = ServerFiles(self.home)
        return PolledWait(PAUSE_LIMIT_SECONDS, PAUSE_LOOK_SECONDS).until(lambda: files.phase().runs_programs and not placement.holds(run))
