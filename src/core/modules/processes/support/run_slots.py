from dataclasses import replace

from core.base.command.context import Context
from core.base.query.conditions.among import Among
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.modules.processes.models.enums.process_state import RUNNING_STATES
from core.modules.processes.models.process import Process
from core.modules.processes.models.support.process_setting import ProcessSetting
from core.modules.processes.support.output_folder import OutputFolder
from core.modules.processes.support.process_settings import ProcessSettings
from core.modules.processes.support.run_queue_halt import RunQueueHalt


class RunSlots:
    """Gives the queued runs a spot, oldest first, while fewer hold one than the batch size and the queue is not
    halted; a run that holds a spot goes on whatever the queue does."""

    def __init__(self, queries: Queries, repository: Repository, folder: OutputFolder, settings: ProcessSettings, halt: RunQueueHalt) -> None:
        self.queries, self.repository, self.folder, self.settings, self.halt = queries, repository, folder, settings, halt

    def grant(self, environment_id: int, context: Context) -> None:
        if self.halt.is_halted:
            return
        runs = tuple(self.queries.query(Process).matching(Among("state", RUNNING_STATES)).oldest().all_rows())
        room = self.settings.integer(ProcessSetting.RUN_BATCH_SIZE, environment_id) - sum(self.folder.has_slot(process.id) for process in runs)
        for waiting in [process for process in runs if process.is_queued][:max(room, 0)]:
            process = self.queries.query(Process).find(waiting.id)
            if process.is_queued:
                self.folder.write_slot(process.id)
                self.repository.save(replace(process, is_queued=False), context)

    def grant_for_oldest_queued(self, context: Context) -> None:
        queued = self.queries.query(Process).matching(Among("state", RUNNING_STATES)).filter(is_queued=True).oldest().first()
        if queued is not None:
            self.grant(queued.environment_id, context)
