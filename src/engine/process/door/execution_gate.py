from engine.database.database import Database
from engine.errors.refusal import Refusal
from engine.journal.journal_home import JournalHome
from engine.process.door.placed_run import PlacedRun
from engine.process.door.run_pauses import RunPauses
from engine.serving.server_files import ServerFiles
from engine.time.polled_wait import PolledWait

PAUSE_LIMIT_SECONDS = 30
PAUSE_LOOK_SECONDS = 0.5
PAUSED_AGENT_REFUSAL = "your agent is paused; it runs nothing until it is resumed"
PAUSED_AGENT_HELP = "answer in the chat, and run it again once you are resumed"


class ExecutionGate:
    """Holds the door while the server starts or updates, and shuts it to an agent that is paused. A run waits
    until the server is ready, at most a short safety limit; a run asked for inside a write is refused at once
    instead, since its wait would hold the write lock the update waits for. A run that takes a place in the
    queue for a paused agent is refused; a quick run or a read still passes, so the agent can look things up
    and answer in the chat."""

    def __init__(self, home: JournalHome, database: Database, pauses: RunPauses) -> None:
        self.home, self.database, self.pauses = home, database, pauses

    def opened(self, run: PlacedRun) -> bool:
        if run.request.kind.takes_place and self.pauses.is_paused(run):
            raise Refusal(PAUSED_AGENT_REFUSAL, PAUSED_AGENT_HELP)
        files = ServerFiles(self.home)
        if files.phase().runs_programs:
            return True
        if self.database.has_transaction:
            raise Refusal("the journal is updating, so this run inside a write cannot wait for it", "run it again once the journal reports it started")
        return PolledWait(PAUSE_LIMIT_SECONDS, PAUSE_LOOK_SECONDS).until(lambda: files.phase().runs_programs)
