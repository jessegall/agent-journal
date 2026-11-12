from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.database.database import Database
from engine.listener.rows.event_rows import EventRows
from engine.process.execution import Execution
from engine.process.execution_request import ExecutionRequest
from engine.process.placed_run import PlacedRun
from engine.process.run_placement import RunPlacement
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.processes.commands.end_process.end_process import EndProcess
from core.modules.processes.commands.move_process.move_process import MoveProcess
from core.modules.processes.commands.start_process.start_process import StartProcess
from core.modules.processes.models.process import Process


class ProcessRunPlacement(RunPlacement):
    """Admits a run through the one process queue: it becomes a process row of the agent the request works for,
    or of the environment's main agent when a person or the journal runs it, through the start command every row
    is made by, and its end is recorded on that row. With no agent to own it the run keeps no row."""

    def __init__(self, bus: Bus, database: Database, agents: AgentRows, rows: EventRows) -> None:
        self.bus, self.database, self.agents, self.rows = bus, database, agents, rows

    def placed(self, request: ExecutionRequest) -> PlacedRun:
        agent_id = self.owner_agent_id()
        if agent_id is None:
            return PlacedRun(request, None, False)
        command = StartProcess.single_part(agent_id, request.text, str(request.folder), request.kind.category, int(request.limit_seconds), kind=request.kind.value)
        process = self.bus.run(command, Actor.core(), environment_id=self.environment_id())
        return PlacedRun(request, process.id, request.kind.takes_place and self.rows.required(Process, process.id).slot_assigned)

    def holds(self, run: PlacedRun) -> bool:
        if run.process_id is None:
            return False
        agent = self.agents.find(self.rows.required(Process, run.process_id).session_agent_id)
        return agent.paused_at is not None

    def moved_to_background(self, run: PlacedRun, pid: int) -> None:
        if run.process_id is None:
            return
        self.bus.run(MoveProcess(run.process_id), Actor.core(), environment_id=self.environment_id())

    def ended(self, run: PlacedRun, execution: Execution) -> None:
        if run.process_id is None:
            return
        printed = execution.stdout + execution.stderr
        self.bus.run(EndProcess(run.process_id, execution.exit_code, len(printed.encode()), printed.count("\n")), Actor.core(), environment_id=self.environment_id())

    def owner_agent_id(self) -> int | None:
        owner = self.database.row_owner
        if owner is not None and owner.stored_agent_id is not None:
            return owner.stored_agent_id
        main = self.agents.main_agent()
        return None if main is None else main.id

    def environment_id(self) -> int | None:
        owner = self.database.row_owner
        return None if owner is None else owner.environment_id
