from core.base.command.context import Context
from core.base.command.handler import Handler
from core.modules.library.commands.run_library_sync.run_library_sync import RunLibrarySync
from core.modules.library.support.round_memory import RoundMemory
from core.modules.library.support.sync_outcome import SyncOutcome
from core.modules.library.ticks.library_sync import LibrarySync


class RunLibrarySyncHandler(Handler[RunLibrarySync, SyncOutcome]):
    """Runs a round with no transaction held, since the round asks the server and writes each result in a short
    command of its own. It starts with no memory of an earlier round."""

    command = RunLibrarySync

    def __init__(self, sync: LibrarySync) -> None:
        self.sync = sync

    def handle(self, command: RunLibrarySync, context: Context) -> SyncOutcome:
        return self.sync.round(RoundMemory())
