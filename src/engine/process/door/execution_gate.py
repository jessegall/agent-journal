from engine.journal.journal_home import JournalHome
from engine.serving.server_files import ServerFiles
from engine.time.polled_wait import PolledWait

PAUSE_LIMIT_SECONDS = 30
PAUSE_LOOK_SECONDS = 0.5


class ExecutionGate:
    """Holds the door while the server starts or updates: a run waits until the server is ready, at most a short
    safety limit, since a run may be held inside a write; a paused agent is held by its hooks, not here."""

    def __init__(self, home: JournalHome) -> None:
        self.home = home

    def opened(self) -> bool:
        files = ServerFiles(self.home)
        return PolledWait(PAUSE_LIMIT_SECONDS, PAUSE_LOOK_SECONDS).until(lambda: files.phase().runs_programs)
