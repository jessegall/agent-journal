from collections.abc import Sequence
from dataclasses import replace

from engine.enums.agent_role import AgentRole
from engine.enums.execution_length import ExecutionLength
from engine.enums.execution_source import ExecutionSource
from engine.enums.starter_type import StarterType
from engine.execution.classes.execution_class import ExecutionClass
from engine.execution.classes.execution_classes import ExecutionClasses
from engine.execution.execution_starter import ExecutionStarter
from engine.execution.execution_subject import ExecutionSubject
from engine.execution.execution_ticket import ExecutionTicket
from engine.listener.rows.event_rows import EventRows
from engine.time.clock import Clock
from core.modules.agents.models.agent import Agent
from core.modules.processes.models.enums.process_state import ProcessState
from core.modules.processes.models.process import Process
from core.modules.processes.support.pool_tickets import PoolTickets
from core.modules.processes.support.process_type_start_check import ProcessTypeStartCheck
from core.modules.processes.support.process_type_limits import ProcessTypeLimits
from core.modules.processes.support.run_start_check import RunStartCheck


class ExecutionTickets:
    """Turns process rows into the tickets of one lane: a row keeps its class, priorities and raise time, a
    row of no class is matched again, a plugin's kind takes its own class, and a run whose reader request
    is open waits for its reader."""

    def __init__(self, classes: ExecutionClasses, category_limits: ProcessTypeLimits, start_check: RunStartCheck, rows: EventRows, clock: Clock) -> None:
        self.classes, self.kind_limits, self.start_check, self.rows, self.clock = classes, category_limits, start_check, rows, clock

    def row_tickets(self, processes: Sequence[Process], pool: ExecutionLength) -> PoolTickets:
        return self.row_pools(processes)[pool]

    def row_pools(self, processes: Sequence[Process]) -> dict[ExecutionLength, PoolTickets]:
        return self.pools(processes, self.kind_limits.admissions([process for process in processes if process.queued_at is not None]))

    # every row is read once for all lanes: its agent, its kind's class and its parts
    def pools(self, processes: Sequence[Process], categories: ProcessTypeStartCheck) -> dict[ExecutionLength, PoolTickets]:
        agents = self.rows.required_index(Agent, [process.session_agent_id for process in processes])
        category_classes = categories.category_class_map()
        parts = self.start_check.waiting_parts([process for process in processes if process.queued_at is not None])
        tickets = [(process, self.ticket(process, agents[process.session_agent_id], category_classes, parts)) for process in processes]
        return {pool: PoolTickets(tuple(ticket for process, ticket in tickets if ticket.execution_class.pool is pool and process.queued_at is not None),
                                  tuple(ticket for process, ticket in tickets if ticket.execution_class.pool is pool and process.queued_at is None))
                for pool in ExecutionLength}

    def ticket(self, process: Process, agent: Agent, category_classes: dict[tuple[str, str], ExecutionClass], parts: dict) -> ExecutionTicket:
        starter = self.starter(process, agent)
        execution_class = self.execution_class(process, starter, category_classes)
        # a line moved to the background gives its short place back and counts in the long lane at its own cost
        if process.state is ProcessState.BACKGROUND and execution_class.pool is not ExecutionLength.LONG:
            execution_class = replace(execution_class, name=f"{execution_class.name} in the background", pool=ExecutionLength.LONG)
        entered_at = process.queued_at or process.started_at or process.creation_timestamp()
        waits_reader = process.queued_at is not None and self.start_check.awaits_reader(process, parts.get(process.id, ()), self.clock.timestamp())
        return ExecutionTicket(execution_class, process.first_priority, process.priority, starter, process.line, entered_at, process.raised_at or entered_at,
                               has_open_reader_request=waits_reader, run_id=process.id)

    def execution_class(self, process: Process, starter: ExecutionStarter, category_classes: dict[tuple[str, str], ExecutionClass]) -> ExecutionClass:
        if process.plugin and (process.plugin, process.run_name) in category_classes:
            return category_classes[(process.plugin, process.run_name)]
        labelled = self.classes.by_name(process.execution_class) if process.execution_class else None
        if labelled is not None:
            return labelled
        source = ExecutionSource.PLUGIN_PROGRAM if process.plugin else ExecutionSource.SHELL_LINE
        return self.classes.match(ExecutionSubject(source, starter, category=process.category, plugin_name=process.plugin, plugin_category=process.run_name, line=process.line))

    @staticmethod
    def starter(process: Process, agent: Agent) -> ExecutionStarter:
        if process.plugin:
            return ExecutionStarter(StarterType.PLUGIN, plugin_name=process.plugin)
        if agent.role == AgentRole.MAIN:
            return ExecutionStarter(StarterType.MAIN_AGENT, agent_id=agent.id)
        return ExecutionStarter(StarterType.HELPER, agent_id=agent.id, agent_role=str(agent.role))
