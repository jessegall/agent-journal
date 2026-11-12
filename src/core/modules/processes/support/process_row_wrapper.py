from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.database.database import Database
from engine.enums.process_kind import ProcessKind
from engine.process.request_records import RequestRecords
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.processes.commands.end_process.end_process import EndProcess
from core.modules.processes.commands.record_request_run.record_request_run import RecordRequestRun


class ProcessRowWrapper(RequestRecords):
    """Wraps a hook, journal command or viewer request in its process row: one insert when it comes in and its end
    when it answers, as a run of the agent it works for, or of the environment's main agent for a person. Such a
    row is priority 0: it takes no place, never moves to the background and gives no output number."""

    def __init__(self, bus: Bus, database: Database, agents: AgentRows) -> None:
        self.bus, self.database, self.agents = bus, database, agents

    def begun(self, kind: ProcessKind, line: str) -> int | None:
        agent_id = self.owner_agent_id()
        if agent_id is None:
            return None
        return self.bus.run(RecordRequestRun(agent_id, kind, line), Actor.core(), environment_id=self.environment_id()).id

    def ended(self, row_id: int | None, exit_code: int) -> None:
        if row_id is None:
            return
        self.bus.run(EndProcess(row_id, exit_code, 0, 0), Actor.core(), environment_id=self.environment_id())

    def owner_agent_id(self) -> int | None:
        owner = self.database.row_owner
        if owner is not None and owner.stored_agent_id is not None:
            return owner.stored_agent_id
        main = self.agents.main_agent()
        return None if main is None else main.id

    def environment_id(self) -> int | None:
        owner = self.database.row_owner
        return None if owner is None else owner.environment_id
