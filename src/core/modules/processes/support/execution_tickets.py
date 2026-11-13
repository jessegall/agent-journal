from collections.abc import Sequence
from dataclasses import replace

from engine.enums.agent_role import AgentRole
from engine.enums.execution_lane import ExecutionLane
from engine.enums.execution_source import ExecutionSource
from engine.enums.starter_type import StarterType
from engine.execution.execution_class import ExecutionClass
from engine.execution.execution_classes import ExecutionClasses
from engine.execution.execution_starter import ExecutionStarter
from engine.execution.execution_subject import ExecutionSubject
from engine.execution.execution_ticket import ExecutionTicket
from engine.listener.rows.event_rows import EventRows
from engine.time.clock import Clock
from core.modules.agents.models.agent import Agent
from core.modules.processes.models.enums.process_state import ProcessState
from core.modules.processes.models.process import Process
from core.modules.processes.support.lane_tickets import LaneTickets
from core.modules.processes.support.process_type_limits import ProcessTypeLimits
from core.modules.processes.support.run_admission import RunAdmission


class ExecutionTickets:
    """Turns process rows into the tickets of one lane: a row keeps its class, priorities and raise time, a row of
    no class is matched again, a plugin's kind takes its own class, and a run whose reader request is open waits
    for its reader."""

    def __init__(self, classes: ExecutionClasses, kind_limits: ProcessTypeLimits, admission: RunAdmission, rows: EventRows, clock: Clock) -> None:
        self.classes, self.kind_limits, self.admission, self.rows, self.clock = classes, kind_limits, admission, rows, clock

    def of_rows(self, processes: Sequence[Process], lane: ExecutionLane) -> LaneTickets:
        return self.lanes(processes)[lane]

    # every row is read once for all lanes: its agent, its kind's class and its parts
    def lanes(self, processes: Sequence[Process]) -> dict[ExecutionLane, LaneTickets]:
        agents = self.rows.required_index(Agent, [process.session_agent_id for process in processes])
        kind_classes = self.kind_limits.kind_classes([process for process in processes if process.queued_at is not None])
        parts = self.admission.waiting_parts([process for process in processes if process.queued_at is not None])
        tickets = [(process, self.ticket(process, agents[process.session_agent_id], kind_classes, parts)) for process in processes]
        return {lane: LaneTickets(tuple(ticket for process, ticket in tickets if ticket.execution_class.lane is lane and process.queued_at is not None),
                                  tuple(ticket for process, ticket in tickets if ticket.execution_class.lane is lane and process.queued_at is None))
                for lane in ExecutionLane}

    def ticket(self, process: Process, agent: Agent, kind_classes: dict[tuple[str, str], ExecutionClass], parts: dict) -> ExecutionTicket:
        starter = self.starter(process, agent)
        execution_class = self.execution_class(process, starter, kind_classes)
        # a line moved to the background gives its short place back and counts in the long lane at its own cost
        if process.state is ProcessState.BACKGROUND and execution_class.lane is not ExecutionLane.LONG:
            execution_class = replace(execution_class, name=f"{execution_class.name} in the background", lane=ExecutionLane.LONG)
        entered_at = process.queued_at or process.started_at or process.creation_timestamp()
        waits_for_reader = process.queued_at is not None and self.admission.waits_for_reader(process, parts.get(process.id, ()), self.clock.timestamp())
        return ExecutionTicket(execution_class, process.first_priority, process.priority, starter, process.line, entered_at, process.raised_at or entered_at,
                               has_open_reader_request=waits_for_reader, run_id=process.id)

    def execution_class(self, process: Process, starter: ExecutionStarter, kind_classes: dict[tuple[str, str], ExecutionClass]) -> ExecutionClass:
        if process.plugin and (process.plugin, process.run_name) in kind_classes:
            return kind_classes[(process.plugin, process.run_name)]
        named = self.classes.named(process.execution_class) if process.execution_class else None
        if named is not None:
            return named
        source = ExecutionSource.PLUGIN_PROGRAM if process.plugin else ExecutionSource.SHELL_LINE
        return self.classes.match(ExecutionSubject(source, starter, category=process.category, plugin_name=process.plugin, plugin_kind=process.run_name, line=process.line))

    @staticmethod
    def starter(process: Process, agent: Agent) -> ExecutionStarter:
        if process.plugin:
            return ExecutionStarter(StarterType.PLUGIN, plugin_name=process.plugin)
        if agent.role == AgentRole.MAIN:
            return ExecutionStarter(StarterType.MAIN_AGENT, agent_id=agent.id)
        return ExecutionStarter(StarterType.HELPER, agent_id=agent.id, agent_role=str(agent.role))
