from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.database.database import Database
from engine.listener.rows.event_rows import EventRows
from engine.process.door.execution import Execution
from engine.process.door.execution_request import ExecutionRequest
from engine.process.door.placed_run import PlacedRun
from engine.process.door.run_placement import RunPlacement
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.processes.commands.end_process.end_process import EndProcess
from core.modules.processes.commands.move_process.move_process import MoveProcess
from core.modules.processes.commands.record_request_run.record_request_run import RecordRequestRun
from core.modules.processes.models.process import Process


class ProcessRunPlacement(RunPlacement):
    """Admits a run through the one process queue: it becomes a process row of the agent the request works for,
    or of the environment's main agent when a person or the journal runs it, through the start command every row
    is made by, and its end is recorded on that row. With no agent to own it the run keeps no row."""

    def __init__(self, bus: Bus, database: Database, agents: AgentRows, rows: EventRows) -> None:
        self.bus, self.database, self.agents, self.rows = bus, database, agents, rows

    def placed(self, request: ExecutionRequest) -> PlacedRun:
        agent = self.owner_agent()
        if agent is None:
            return PlacedRun(request, None, False)
        return PlacedRun(request, None, False, agent.id, agent.environment_id, agent.paused_at is not None)

    def moved_to_background(self, run: PlacedRun, pid: int) -> None:
        return None

    def ended(self, run: PlacedRun, execution: Execution) -> int | None:
        if run.agent_id is None:
            return None
        command = RecordRequestRun(run.agent_id, run.request.kind, run.request.text, execution.exit_code)
        return self.bus.run(command, Actor.core(), environment_id=run.environment_id).id

    def owner_agent(self) -> Agent | None:
        owner = self.database.row_owner
        if owner is not None and owner.stored_agent_id is not None:
            return self.agents.find(owner.stored_agent_id)
        return self.agents.main_agent()
