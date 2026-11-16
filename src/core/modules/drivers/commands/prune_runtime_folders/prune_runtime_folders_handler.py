import socket
import stat

from pathlib import Path

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
DEAD_SOCKET_SECONDS = 3600
LAUNCH_SOCKET_PATTERN = "l-*"
FILE_SCAN_FOLDER = "file-scan"
TERMINALS_FOLDER = "terminals"


class PruneRuntimeFoldersHandler(Handler[PruneRuntimeFolders, int]):
    """Removes a file scan state folder untouched for three days, since a scan touches its folder each
    time, and the terminal log of an agent that ended, once the log is three days old, and a socket of an
    older program launch that nothing answers on, left in the journal folder by a launch that was killed,
    once it is an hour old."""

    command = PruneRuntimeFolders
    runs_once = True

    def __init__(self, queries: Queries, home: JournalHome, clock: Clock) -> None:
        self.queries, self.home, self.clock = queries, home, clock

    def handle(self, command: PruneRuntimeFolders, context: Context) -> int:
        return self.pruned_scan_states() + self.pruned_terminal_logs() + self.pruned_dead_sockets()

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

    def pruned_dead_sockets(self) -> int:
        dead = [path for path in FileAccess.glob(self.home.folder, LAUNCH_SOCKET_PATTERN) if self.is_dead_socket(path)]
        for path in dead:
            FileAccess.unlink(path, missing_ok=True)
        return len(dead)

    def is_dead_socket(self, path: Path) -> bool:
        status = FileAccess.stat(path)
        if not stat.S_ISSOCK(status.st_mode) or self.clock.unix_seconds() - status.st_mtime <= DEAD_SOCKET_SECONDS:
            return False
        with socket.socket(socket.AF_UNIX) as probe:
            probe.settimeout(1)
            try:
                probe.connect(str(path))
            except (ConnectionRefusedError, FileNotFoundError):
                return True
            except OSError:
                return False
        return False

    def is_old(self, modified_at: float) -> bool:
        return self.clock.unix_seconds() - modified_at > KEPT_SECONDS
