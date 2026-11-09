from core.modules.processes.support.run_counts import RunCounts
from dataclasses import replace

from core.base.command.context import Context
from core.base.clock import Clock
from core.base.listener.event_rows import EventRows
from core.base.database.kept_rows import KeptRows
from core.base.query.conditions.among import Among
from core.base.query.conditions.has_value import HasValue
from core.base.query.conditions.is_null import IsNull
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.base.scope.scopes import Scopes
from core.modules.agents.models.agent import Agent
from core.modules.processes.models.enums.process_state import RUNNING_STATES
from core.modules.processes.models.process import Process
from core.modules.processes.models.support.process_setting import ProcessSetting
from core.modules.processes.queries.output_query import OutputQuery
from core.modules.processes.support.output_folder import OutputFolder
from core.modules.processes.support.process_settings import ProcessSettings
from core.modules.processes.support.run_queue_halt import RunQueueHalt
from core.modules.processes.support.run_admission import RunAdmission


class RunSlots:
    """Admits every run, granting immediate runs and giving waiting runs capacity in order."""

    def __init__(self, queries: Queries, repository: Repository, folder: OutputFolder, settings: ProcessSettings, halt: RunQueueHalt, admission: RunAdmission, clock: Clock, listings: RunCounts, rows: EventRows, kept: KeptRows, scopes: Scopes, outputs: OutputQuery) -> None:
        self.queries, self.repository, self.folder, self.settings, self.halt = queries, repository, folder, settings, halt
        self.admission, self.clock, self.listings = admission, clock, listings
        self.rows, self.kept, self.scopes, self.outputs = rows, kept, scopes, outputs

    def grant(self, context: Context) -> None:
        for waiting in [process for process in self.running() if process.queued_at is not None]:
            agent = self.rows.required(Agent, waiting.session_agent_id)
            needs_slot = self.admission.needs_slot(waiting, agent)
            if not self.admission.may_start(waiting, agent, self.clock.timestamp()):
                continue
            process = self.rows.required(Process, waiting.id)
            used_slots = sum(self.admission.uses_slot(run) for run in self.running() if run.queued_at is None)
            room = self.settings.integer(ProcessSetting.RUN_BATCH_SIZE) - used_slots
            if needs_slot and (self.halt.is_halted or room <= 0):
                continue
            self.folder.write_slot(process.id)
            admitted = replace(process, queued_at=None, slot_assigned=needs_slot, started_at=context.timestamp)
            saved = self.repository.save_change(process, admitted, context)
            self.remember(saved)

    def remember(self, process: Process) -> None:
        self.kept.scoped_update("processes", lambda runs: tuple(sorted([run for run in runs if run.id != process.id]
                                  + ([process] if process.state in RUNNING_STATES else []), key=lambda run: run.id)),
                                  "state IN (?, ?)", [*RUNNING_STATES], name="processes.slot_runs")

    def running(self) -> tuple[Process, ...]:
        return self.kept.scoped_read("processes", lambda: tuple(self.queries.query(Process).matching(Among("state", RUNNING_STATES)).oldest().all_rows()),
                                       "state IN (?, ?)", [*RUNNING_STATES], name="processes.slot_runs")

    def grant_all_environments(self, context: Context) -> None:
        queued = self.queries.query(Process).matching(Among("state", RUNNING_STATES)).matching(HasValue("queued_at")).oldest().all_rows()
        for environment_id in dict.fromkeys(process.environment_id for process in tuple(queued)):
            with self.scopes.opened(None, environment_id):
                self.grant(context)

    def take_counts(self, context: Context) -> None:
        started = self.queries.query(Process).matching(Among("state", RUNNING_STATES)).matching(IsNull("queued_at")).filter(is_queue_run=True).oldest().all_rows()
        for process in tuple(started):
            if self.folder.is_count_taken(process.id) or self.folder.count_status(process.id) is None:
                continue
            with self.scopes.opened(None, process.environment_id):
                self.record_count(process, self.rows.required(Agent, process.session_agent_id), context)
            self.folder.mark_count_taken(process.id)

    def record_count(self, process: Process, agent: Agent, context: Context) -> None:
        status = self.folder.count_status(process.id)
        count = self.listings.count(process, self.folder.count_text(process.id)) if status == 0 else 0
        self.listings.reject_unknown(process, agent, status, count, context)
        output = self.outputs.process_output(process.id)
        if count and output is not None and output.test_count != count:
            self.repository.update(output, context, test_count=count)
