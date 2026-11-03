from dataclasses import replace

from core.base.change.change import Change
from core.base.listener.save_listener import SaveListener
from core.base.model.model import Model
from core.base.query.conditions.among import Among
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.modules.processes.models.enums.process_state import RUNNING_STATES
from core.modules.processes.models.process import Process
from core.modules.processes.models.support.process_setting import ProcessSetting
from core.modules.processes.support.output_folder import OutputFolder
from core.modules.processes.support.process_settings import ProcessSettings


class RunSlotListener(SaveListener):
    """The queue of an environment's runs: whenever one of its runs is queued or ends, its queued runs get a
    spot, oldest first, while fewer hold one than the environment's batch size. The runner holds a queued run's
    line until its spot is written. The main agent's runs never queue and hold no spot."""

    name = "processes.run-slots"
    event = "process.*"

    def __init__(self, queries: Queries, repository: Repository, folder: OutputFolder, settings: ProcessSettings) -> None:
        self.queries, self.repository, self.folder, self.settings = queries, repository, folder, settings

    def handle(self, change: Change[Model]) -> None:
        run = change.new_row
        if not isinstance(run, Process) or not self.may_free_spot(change.old_row, run):
            return
        runs = tuple(self.queries.query(Process).filter(environment_id=run.environment_id).matching(Among("state", RUNNING_STATES)).oldest().all_rows())
        room = self.settings.integer(ProcessSetting.RUN_BATCH_SIZE, run.environment_id) - sum(self.folder.has_slot(process.id) for process in runs)
        for process in [process for process in runs if process.is_queued][:max(room, 0)]:
            self.repository.save(replace(process, is_queued=False), change.context)
            self.folder.write_slot(process.id)

    @staticmethod
    def may_free_spot(old_run: Model | None, run: Process) -> bool:
        ended = isinstance(old_run, Process) and old_run.state in RUNNING_STATES and run.state not in RUNNING_STATES
        return run.is_queued or ended
