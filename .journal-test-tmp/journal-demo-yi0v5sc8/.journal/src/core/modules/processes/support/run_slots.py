from core.modules.processes.models.output import Output
from core.modules.processes.support.run_counts import RunCounts
from dataclasses import replace

from core.base.command.context import Context
from core.base.clock import Clock
from core.base.query.conditions.among import Among
from core.base.query.conditions.has_value import HasValue
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.modules.agents.models.agent import Agent
from core.modules.processes.models.enums.process_state import RUNNING_STATES
from core.modules.processes.models.process import Process
from core.modules.processes.models.support.process_setting import ProcessSetting
from core.modules.processes.support.output_folder import OutputFolder
from core.modules.processes.support.process_settings import ProcessSettings
from core.modules.processes.support.run_queue_halt import RunQueueHalt
from core.modules.processes.support.run_admission import RunAdmission


class RunSlots:
    """Admits every run, granting immediate runs and giving waiting runs capacity in order."""

    def __init__(self, queries: Queries, repository: Repository, folder: OutputFolder, settings: ProcessSettings, halt: RunQueueHalt, admission: RunAdmission, clock: Clock, listings: RunCounts) -> None:
        self.queries, self.repository, self.folder, self.settings, self.halt = queries, repository, folder, settings, halt
        self.admission, self.clock, self.listings = admission, clock, listings

    def grant(self, environment_id: int, context: Context) -> None:
        runs = self.running(environment_id)
        for waiting in [process for process in runs if process.queued_at is not None]:
            agent = self.queries.query(Agent).find(waiting.agent_id)
            needs_slot = self.admission.needs_slot(waiting, agent)
            if not self.admission.may_start(waiting, agent, self.clock.timestamp()):
                continue
            process = self.queries.query(Process).find(waiting.id)
            self.record_count(process, context)
            process = self.queries.query(Process).find(process.id)
            if process.queued_at is None or process.state not in RUNNING_STATES:
                continue
            used_slots = sum(self.admission.uses_slot(run) for run in self.running(environment_id) if run.queued_at is None)
            room = self.settings.integer(ProcessSetting.RUN_BATCH_SIZE, environment_id) - used_slots
            if needs_slot and (self.halt.is_halted or room <= 0):
                continue
            self.folder.write_slot(process.id)
            admitted = replace(process, queued_at=None, slot_assigned=needs_slot, started_at=context.timestamp)
            self.repository.save(admitted, context)

    def running(self, environment_id: int) -> tuple[Process, ...]:
        return tuple(self.queries.query(Process).filter(environment_id=environment_id).matching(Among("state", RUNNING_STATES)).oldest().all_rows())

    def grant_all_environments(self, context: Context) -> None:
        queued = self.queries.query(Process).matching(Among("state", RUNNING_STATES)).matching(HasValue("queued_at")).oldest().all_rows()
        for environment_id in dict.fromkeys(process.environment_id for process in tuple(queued)):
            self.grant(environment_id, context)

    def record_count(self, process: Process, context: Context) -> None:
        if self.folder.count_status(process.id) != 0:
            return
        count = self.listings.count(process, self.folder.count_text(process.id))
        outputs = self.queries.query(Output).filter(process_id=process.id).limited(1)
        if count and outputs and outputs[0].test_count != count:
            self.repository.save(replace(outputs[0], test_count=count), context)
