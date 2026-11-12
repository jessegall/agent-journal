from dataclasses import replace

from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.command.context import Context
from engine.database.database import Database
from engine.listener.rows.event_rows import EventRows
from core.modules.agents.models.agent import Agent
from core.modules.processes.models.process import Process
from engine.enums.process_kind import ProcessKind
from engine.process.request_records import RequestRecords
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.processes.commands.end_process.end_process import EndProcess
from core.modules.processes.commands.record_request_run.record_request_run import RecordRequestRun


class ProcessRowWrapper(RequestRecords):
    """Wraps a hook, journal command or viewer request in its process row: one insert when it comes in and its end
    when it answers, as a run of the agent it works for, or of the environment's main agent for a person. Such a
    row is priority 0: it takes no place, never moves to the background and gives no output number."""

    def __init__(self, bus: Bus, database: Database, agents: AgentRows, rows: EventRows) -> None:
        self.bus, self.database, self.agents, self.rows = bus, database, agents, rows

    def begun(self, kind: ProcessKind, line: str) -> int | None:
        agent = self.owner_agent()
        if agent is None:
            return None
        return self.bus.run(RecordRequestRun(agent.id, kind, line), Actor.core(), environment_id=agent.environment_id).id

    def ended(self, row_id: int | None, exit_code: int) -> None:
        if row_id is None:
            return
        process = self.rows.required(Process, row_id)
        self.bus.run(EndProcess(row_id, exit_code, 0, 0), Actor.core(), environment_id=process.environment_id)

    def ended_now(self, kind: ProcessKind, line: str, exit_code: int) -> None:
        agent = self.owner_agent()
        if agent is None:
            return
        self.bus.run(RecordRequestRun(agent.id, kind, line, exit_code), Actor.core(), environment_id=agent.environment_id)

    def recorded_hook(self, agent_id: int, line: str, exit_code: int, context: Context) -> None:
        self.bus.dispatch(RecordRequestRun(agent_id, ProcessKind.HOOK, line, exit_code), replace(context, environment_id=self.agents.find(agent_id).environment_id))

    def owner_agent(self) -> Agent | None:
        owner = self.database.row_owner
        if owner is not None and owner.stored_agent_id is not None:
            return self.agents.find(owner.stored_agent_id)
        return self.agents.main_agent()
