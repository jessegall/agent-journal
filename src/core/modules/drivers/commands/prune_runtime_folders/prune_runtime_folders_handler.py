from engine.file.file_access import FileAccess

from engine.command.context import Context
from engine.command.handler import Handler
from engine.journal.journal_home import JournalHome
from engine.query.conditions.among import Among
from engine.query.queries import Queries
from engine.time.clock import Clock
from core.modules.agents.models.agent import Agent
from core.modules.drivers.commands.prune_runtime_folders.prune_runtime_folders import PruneRuntimeFolders

KEPT_SECONDS = 3 * 24 * 3600
FILE_SCAN_FOLDER = "file-scan"
TERMINALS_FOLDER = "terminals"


class PruneRuntimeFoldersHandler(Handler[PruneRuntimeFolders, int]):
    """Removes a file scan state folder untouched for three days, since a scan touches its folder each time, and
    the terminal log of an agent that ended, once the log is three days old."""

    command = PruneRuntimeFolders
    runs_once = True

    def __init__(self, queries: Queries, home: JournalHome, clock: Clock) -> None:
        self.queries, self.home, self.clock = queries, home, clock

    def handle(self, command: PruneRuntimeFolders, context: Context) -> int:
        return self.pruned_scan_states() + self.pruned_terminal_logs()

    def pruned_scan_states(self) -> int:
        folder = self.home.folder / "runtime" / FILE_SCAN_FOLDER
        stale = [state for state in FileAccess.iterdir(folder) if self.is_old(FileAccess.stat(state).st_mtime)] if FileAccess.is_dir(folder) else []
        for state in stale:
            FileAccess.rmtree(state, ignore_errors=True)
        return len(stale)

    def pruned_terminal_logs(self) -> int:
        folder = self.home.folder / "runtime" / TERMINALS_FOLDER
        old_logs = {int(log.stem): log for log in FileAccess.glob(folder, "*.log") if log.stem.isdigit() and self.is_old(FileAccess.stat(log).st_mtime)} if FileAccess.is_dir(folder) else {}
        running = {agent.id for agent in self.queries.query(Agent).matching(Among("id", list(old_logs))).every_row("the agents whose old terminal logs may go") if agent.ended_at is None}
        removed = [log for agent_id, log in old_logs.items() if agent_id not in running]
        for log in removed:
            FileAccess.unlink(log, missing_ok=True)
        return len(removed)

    def is_old(self, modified_at: float) -> bool:
        return self.clock.epoch_seconds() - modified_at > KEPT_SECONDS
