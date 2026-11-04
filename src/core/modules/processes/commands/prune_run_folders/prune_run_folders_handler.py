from itertools import batched

from core.base.command.context import Context
from core.base.command.handler import Handler
from core.modules.processes.commands.prune_run_folders.prune_run_folders import PruneRunFolders
from core.modules.processes.queries.process_query import ProcessQuery
from core.modules.processes.support.output_folder import OutputFolder

ENDED_SECONDS = 600
MOST_FOLDERS = 2000
QUERY_FOLDERS = 500


class PruneRunFoldersHandler(Handler[PruneRunFolders, int]):
    """Removes the folders of runs that ended a while ago and kept no output, a short run's: nothing reads them,
    and the rolling limit on kept outputs never sees them. Each round removes a bounded number."""

    command = PruneRunFolders

    def __init__(self, processes: ProcessQuery, folder: OutputFolder) -> None:
        self.processes, self.folder = processes, folder

    def handle(self, command: PruneRunFolders, context: Context) -> int:
        removed = 0
        for process_ids in batched(self.folder.process_ids(), QUERY_FOLDERS):
            for process in self.processes.ended_without_kept_output(process_ids, context.timestamp, ENDED_SECONDS).all_rows():
                self.folder.remove(process.id)
                removed += 1
            if removed >= MOST_FOLDERS:
                break
        return removed
