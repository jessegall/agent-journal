from dataclasses import replace

from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.command.context import Context
from engine.database.database import Database
from core.modules.agents.models.agent import Agent
from engine.enums.process_kind import ProcessKind
from engine.process.door.request_records import RequestRecords
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.processes.commands.record_request_run.record_request_run import RecordRequestRun


class ProcessRowWrapper(RequestRecords):
    """Keeps the row of a hook, journal command or viewer request once it answered: one insert, as a run of the agent
    it works for, or of the environment's main agent for a person. Such a row is priority 0: it takes no place,
    never moves to the background and gives no output number."""

    def __init__(self, bus: Bus, database: Database, agents: AgentRows) -> None:
        self.bus, self.database, self.agents = bus, database, agents

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
