from engine.command.context import Context
from engine.command.handler import Handler
from engine.repository.repository import Repository
from core.modules.processes.commands.prune_processes.prune_processes import PruneProcesses
from core.modules.processes.models.enums.process_setting import ProcessSetting
from core.modules.processes.queries.process_query import ProcessQuery
from core.modules.processes.support.process_settings import ProcessSettings

PROCESS_BATCH_COUNT = 50


class PruneProcessesHandler(Handler[PruneProcesses, int]):
    """Removes the oldest ended processes while keeping every running process. Answers how many it removed."""

    command = PruneProcesses

    def __init__(self, processes: ProcessQuery, repository: Repository, settings: ProcessSettings) -> None:
        self.processes, self.repository, self.settings = processes, repository, settings

    def handle(self, command: PruneProcesses, context: Context) -> int:
        ended = self.processes.ended()
        process_count = max(1, self.settings.integer(ProcessSetting.PROCESSES_KEPT))
        excess_count = ended.count() - process_count
        if excess_count <= 0:
            return 0
        processes = ended.ordered("ended_at", "id").limited(min(excess_count, PROCESS_BATCH_COUNT))
        self.repository.delete_many_stored(processes, context)
        return len(processes)
