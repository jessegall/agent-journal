from collections.abc import Sequence
from dataclasses import replace

from core.base.command.context import Context
from core.base.clock import Clock
from core.base.query.conditions.among import Among
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.modules.agents.support.main_agent_finder import MainAgentFinder
from core.modules.processes.models.enums.process_state import RUNNING_STATES
from core.modules.processes.models.process import Process
from core.modules.processes.models.support.process_setting import ProcessSetting
from core.modules.processes.support.output_folder import OutputFolder
from core.modules.processes.support.process_settings import ProcessSettings
from core.modules.processes.support.run_queue_halt import RunQueueHalt
from core.modules.processes.support.run_admission import RunAdmission


class RunSlots:
    """Gives the queued runs of an environment a spot, oldest first, while fewer of its runs hold one than its
    batch size and the queue is not halted; a run that holds a spot goes on whatever the queue does. With
    main-runs-take-slots on, the main agent's running runs, which hold no spot and never wait, count against
    the batch size too."""

    def __init__(self, queries: Queries, repository: Repository, folder: OutputFolder, settings: ProcessSettings, halt: RunQueueHalt, admission: RunAdmission, clock: Clock) -> None:
        self.queries, self.repository, self.folder, self.settings, self.halt = queries, repository, folder, settings, halt
        self.admission, self.clock = admission, clock

    def grant(self, environment_id: int, context: Context) -> None:
        if self.halt.is_halted:
            return
        runs = tuple(self.queries.query(Process).filter(environment_id=environment_id).matching(Among("state", RUNNING_STATES)).oldest().all_rows())
        used_slots = sum(self.folder.has_slot(process.id) for process in runs) + self.main_runs_taking_spots(runs, environment_id)
        room = self.settings.integer(ProcessSetting.RUN_BATCH_SIZE, environment_id) - used_slots
        for waiting in [process for process in runs if process.is_queued and self.admission.may_start(process, self.clock.timestamp())][:max(room, 0)]:
            process = self.queries.query(Process).find(waiting.id)
            if process.is_queued:
                self.folder.write_slot(process.id)
                self.repository.save(replace(process, is_queued=False), context)

    def main_runs_taking_spots(self, runs: Sequence[Process], environment_id: int) -> int:
        if not self.settings.flag(ProcessSetting.MAIN_RUNS_USE_SLOTS, environment_id):
            return 0
        running = [process for process in runs if not process.is_queued and not self.folder.has_slot(process.id)]
        main = MainAgentFinder.main_ids(self.queries, tuple({process.agent_id for process in running})) if running else set[int]()
        return sum(1 for process in running if process.agent_id in main)

    def grant_all_environments(self, context: Context) -> None:
        queued = self.queries.query(Process).matching(Among("state", RUNNING_STATES)).filter(is_queued=True).oldest().all_rows()
        for environment_id in dict.fromkeys(process.environment_id for process in tuple(queued)):
            self.grant(environment_id, context)
