from engine.database.database import Database
from engine.errors.refusal import Refusal
from engine.journal.journal_home import JournalHome
from engine.serving.server_files import ServerFiles
from engine.time.polled_wait import PolledWait

PAUSE_LIMIT_SECONDS = 30
PAUSE_LOOK_SECONDS = 0.5


class ExecutionGate:
    """Holds the door while the server starts or updates: a run waits until the server is ready, at most a short
    safety limit. A run asked for inside a write is refused at once instead, since its wait would hold the write
    lock the update waits for; a paused agent is held by its hooks, not here."""

    def __init__(self, home: JournalHome, database: Database) -> None:
        self.home, self.database = home, database

    def opened(self) -> bool:
        files = ServerFiles(self.home)
        if files.phase().runs_programs:
            return True
        if self.database.has_transaction:
            raise Refusal("the journal is updating, so this run inside a write cannot wait for it", "run it again once the journal says it started")
        return PolledWait(PAUSE_LIMIT_SECONDS, PAUSE_LOOK_SECONDS).until(lambda: files.phase().runs_programs)
