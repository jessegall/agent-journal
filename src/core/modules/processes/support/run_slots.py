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
from core.modules.processes.queries.output_query import OutputQuery
from core.modules.processes.support.output_folder import OutputFolder
from core.modules.processes.support.process_settings import ProcessSettings
from core.modules.processes.support.run_queue_halt import RunQueueHalt
from core.modules.processes.support.run_admission import RunAdmission
from core.modules.processes.support.process_type_limits import ProcessTypeLimits
from core.modules.processes.support.execution_tickets import ExecutionTickets
from core.modules.processes.support.stored_execution_classes import StoredExecutionClasses
from engine.enums.execution_lane import ExecutionLane
from engine.enums.log_level import LogLevel
from engine.execution.execution_order import ExecutionOrder
from engine.execution.execution_ticket import ExecutionTicket
from engine.log.system_log_writer import SystemLogWriter

SLOT_RUNS_REASON = "the run slots are shared out over every running and queued run"


class RunSlots:
    """Admits the waiting runs of the short and long lanes in the order the one decision gives, by room, priority,
    limits and waits; a plugin's kind of run also waits for its own count and memory."""

    def __init__(self, queries: Queries, repository: Repository, folder: OutputFolder, settings: ProcessSettings, halt: RunQueueHalt, admission: RunAdmission, clock: Clock, listings: RunCounts, rows: EventRows, kept: KeptRows, scopes: Scopes, outputs: OutputQuery, category_limits: ProcessTypeLimits,
                 classes: StoredExecutionClasses, tickets: ExecutionTickets, system_log: SystemLogWriter) -> None:
        self.classes, self.tickets, self.system_log = classes, tickets, system_log
        self.queries, self.repository, self.folder, self.settings, self.halt = queries, repository, folder, settings, halt
        self.admission, self.clock, self.listings = admission, clock, listings
        self.rows, self.kept, self.scopes, self.outputs = rows, kept, scopes, outputs
        self.kind_limits = category_limits

    # each lane's waiting runs start in the order of the one decision; a raise is kept on its row so a restart and the
    # page see it, and the halt holds only the long lane
    def grant(self, context: Context) -> None:
        running, limits, current_time = self.running(), self.classes.lane_limits(), self.clock.timestamp()
        order = ExecutionOrder(limits)
        waiting = [process for process in running if process.queued_at is not None]
        processes = self.rows.required_index(Process, [process.id for process in waiting])
        categories = self.kind_limits.admissions(waiting)
        lanes = self.tickets.lanes(running)
        for lane in (ExecutionLane.SHORT, ExecutionLane.LONG):
            lane_tickets = lanes[lane]
            is_halted = self.halt.is_halted and lane is ExecutionLane.LONG
            for ticket in order.raised(lane_tickets.waiting, current_time, is_halted):
                self.keep_raise(processes[ticket.run_id], ticket, context)
            if order.over_ceiling(lane_tickets.running):
                self.system_log.write(LogLevel.WARNING, f"{len(lane_tickets.running)} immediate runs share the {lane} lane, past its ceiling of {limits.immediate_ceiling}")
            for ticket in order.starting(lane_tickets.waiting, lane_tickets.running, current_time, is_halted):
                process = processes[ticket.run_id]
                if categories.is_blocked(process, self.admitted_runs()):
                    continue
                self.folder.write_slot(process.id)
                admitted = replace(process, queued_at=None, slot_assigned=lane is ExecutionLane.LONG, started_at=context.timestamp)
                saved = self.repository.save_change(process, admitted, context)
                self.remember(saved)
                categories.admitted(saved)

    def keep_raise(self, process: Process, ticket: ExecutionTicket, context: Context) -> None:
        if ticket.priority == process.priority:
            return
        saved = self.repository.save_change(process, replace(process, priority=ticket.priority, raised_at=ticket.raised_at), context)
        self.remember(saved)

    # a run that waits in no lane, an immediate one or a merge the journal runs itself, has its slot written at once
    def grant_at_once(self, process: Process) -> None:
        self.folder.write_slot(process.id)

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

    def claim_counts(self, context: Context) -> None:
        started = self.queries.query(Process).matching(Among("state", RUNNING_STATES)).matching(IsNull("queued_at")).filter(is_queue_run=True).every_row(SLOT_RUNS_REASON)
        counted = [process for process in started if not self.folder.is_count_claimed(process.id) and self.folder.count_status(process.id) is not None]
        agents = self.rows.required_index(Agent, [process.session_agent_id for process in counted])
        for process in counted:
            with self.scopes.opened(None, process.environment_id):
                self.record_count(process, agents[process.session_agent_id], context)
            self.folder.mark_count_claimed(process.id)

    def record_count(self, process: Process, agent: Agent, context: Context) -> None:
        status = self.folder.count_status(process.id)
        text = self.folder.count_text(process.id)
        count = self.listings.count(process, text) if status == 0 else 0
        if text.strip():
            self.listings.reject_unknown(process, agent, status, count, context)
        output = self.outputs.process_output(process.id)
        if count and output is not None and output.test_count != count:
            self.repository.update(output, context, test_count=count)
