from core.modules.processes.support.run_counts import RunCounts
from dataclasses import replace

from engine.command.context import Context
from engine.time.clock import Clock
from engine.listener.rows.event_rows import EventRows
from engine.database.kept_rows import KeptRows
from engine.query.conditions.among import Among
from engine.query.conditions.has_value import HasValue
from engine.query.conditions.is_null import IsNull
from engine.query.queries import Queries
from engine.query.query import Query
from engine.repository.repository import Repository
from engine.scope.scopes import Scopes
from core.modules.agents.models.agent import Agent
from core.modules.processes.models.enums.process_state import RUNNING_STATES
from core.modules.processes.models.process import Process
from core.modules.processes.models.enums.process_setting import ProcessSetting
from core.modules.processes.queries.output_query import OutputQuery
from core.modules.processes.support.output_folder import OutputFolder
from core.modules.processes.support.process_settings import ProcessSettings
from core.modules.processes.support.run_queue_halt import RunQueueHalt
from core.modules.processes.support.run_admission import RunAdmission
from core.modules.processes.support.process_kind_limits import ProcessKindLimits

SLOT_RUNS_REASON = "the run slots are shared out over every running and queued run"


class RunSlots:
    """Admits every run, granting immediate runs and giving waiting runs capacity in order; a run of a kind with
    its own limit also waits while that many of its kind run."""

    def __init__(self, queries: Queries, repository: Repository, folder: OutputFolder, settings: ProcessSettings, halt: RunQueueHalt, admission: RunAdmission, clock: Clock, listings: RunCounts, rows: EventRows, kept: KeptRows, scopes: Scopes, outputs: OutputQuery, kind_limits: ProcessKindLimits) -> None:
        self.queries, self.repository, self.folder, self.settings, self.halt = queries, repository, folder, settings, halt
        self.admission, self.clock, self.listings = admission, clock, listings
        self.rows, self.kept, self.scopes, self.outputs = rows, kept, scopes, outputs
        self.kind_limits = kind_limits

    def grant(self, context: Context) -> None:
        queued = sorted((process for process in self.running() if process.queued_at is not None), key=lambda process: (process.priority.rank, process.id))
        parts = self.admission.waiting_parts(queued)
        self.rows.prepare(Process, [waiting.id for waiting in queued])
        self.rows.prepare(Agent,[waiting.session_agent_id for waiting in queued])
        kinds = self.kind_limits.pass_over(queued)
        for waiting in queued:
            agent = self.rows.required(Agent, waiting.session_agent_id)
            needs_slot = self.admission.needs_slot(waiting, agent)
            if not self.admission.may_start(waiting, agent, parts[waiting.id], self.clock.timestamp()) or kinds.is_held(waiting, self.admitted_runs()):
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
            kinds.admitted(saved)

    def admitted_runs(self) -> tuple[Process, ...]:
        return tuple(run for run in self.running() if run.queued_at is None)

    def remember(self, process: Process) -> None:
        def with_process(runs: tuple[Process, ...]) -> tuple[Process, ...]:
            return tuple(sorted([run for run in runs if run.id != process.id] + ([process] if process.state in RUNNING_STATES else []), key=lambda run: run.id))

        self.kept.update(self.slot_runs(), with_process, name="processes.slot_runs")

    def running(self) -> tuple[Process, ...]:
        runs = self.slot_runs()
        return self.kept.read(runs, lambda: tuple(runs.every_row(SLOT_RUNS_REASON)), name="processes.slot_runs")

    def slot_runs(self) -> Query[Process]:
        return self.queries.query(Process).matching(Among("state", RUNNING_STATES)).oldest()

    def grant_all_environments(self, context: Context) -> None:
        queued = self.queries.query(Process).matching(Among("state", RUNNING_STATES)).matching(HasValue("queued_at")).every_row(SLOT_RUNS_REASON)
        for environment_id in dict.fromkeys(process.environment_id for process in tuple(queued)):
            with self.scopes.opened(None, environment_id):
                self.grant(context)

    def take_counts(self, context: Context) -> None:
        started = self.queries.query(Process).matching(Among("state", RUNNING_STATES)).matching(IsNull("queued_at")).filter(is_queue_run=True).every_row(SLOT_RUNS_REASON)
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
