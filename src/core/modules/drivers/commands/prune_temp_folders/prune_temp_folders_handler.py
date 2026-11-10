import shutil
from pathlib import Path

from engine.time.clock import Clock
from core.base.command.context import Context
from core.base.command.handler import Handler
from engine.journal.journal_home import JournalHome
from core.base.provider.providers import Providers
from engine.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.modules.drivers.commands.prune_temp_folders.prune_temp_folders import PruneTempFolders

UNKNOWN_SESSION_KEPT_SECONDS = 7 * 24 * 3600


class PruneTempFoldersHandler(Handler[PruneTempFolders, int]):
    """Removes a session's temp folder once every agent of that session has ended, never a running session's.
    A folder of a session the journal has no row for stays a week, as it may belong to a session not yet
    known."""

    command = PruneTempFolders
    runs_once = True

    def __init__(self, queries: Queries, providers: Providers, home: JournalHome, clock: Clock) -> None:
        self.queries, self.providers, self.home, self.clock = queries, providers, home, clock

    def handle(self, command: PruneTempFolders, context: Context) -> int:
        project = self.home.folder.resolve().parent
        folders = [(session, folder) for provider in self.providers.all() for session, folder in provider.session_temp_folders(project).items()]
        removable = [folder for session, folder in folders if self.may_remove(session, folder)]
        for folder in removable:
            shutil.rmtree(folder, ignore_errors=True)
        return len(removable)

    def may_remove(self, session: str, folder: Path) -> bool:
        agents = tuple(self.queries.query(Agent).filter(session=session).all_rows())
        if agents:
            return all(agent.ended_at is not None for agent in agents)
        return self.clock.epoch_seconds() - folder.stat().st_mtime > UNKNOWN_SESSION_KEPT_SECONDS
