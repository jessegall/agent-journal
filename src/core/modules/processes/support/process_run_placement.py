from contextlib import AbstractContextManager, nullcontext

from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.database.database import Database
from engine.enums.process_kind import ProcessKind
from engine.process.door.execution import Execution
from engine.process.door.execution_request import ExecutionRequest
from engine.process.door.placed_run import PlacedRun
from engine.process.door.run_placement import RunPlacement
from engine.time.clock import Clock
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.processes.commands.end_process.end_process import EndProcess
from core.modules.processes.commands.start_process.start_process import StartProcess
from core.modules.processes.support.merge_run_lock import MergeRunLock
from core.modules.processes.support.output_folder import OutputFolder
from core.modules.processes.support.request_log import RequestLog
from core.modules.processes.support.request_log_entry import RequestLogEntry

FIRST_PART = 0


class ProcessRunPlacement(RunPlacement):
    """Admits a run of the journal's own through the one door. A merge takes the one merge place, so two merges
    never run at once, and keeps a process row with its output, of the agent it works for or of the environment's
    main agent. Any other run is appended to the request log at its end, so it costs no read and no write; a tick
    writes the log's rows. With no environment to own it a run keeps no row."""

    def __init__(self, database: Database, log: RequestLog, clock: Clock, bus: Bus, agents: AgentRows, outputs: OutputFolder, merges: MergeRunLock) -> None:
        self.database, self.log, self.clock, self.bus, self.agents, self.outputs, self.merges = database, log, clock, bus, agents, outputs, merges

    def placed(self, request: ExecutionRequest) -> PlacedRun:
        owner = self.database.row_owner
        if owner is None or owner.environment_id is None:
            return PlacedRun(request, None, False)
        if request.kind is not ProcessKind.MERGE:
            return PlacedRun(request, None, False, owner.stored_agent_id, owner.environment_id)
        agent_id = owner.stored_agent_id if owner.stored_agent_id is not None else self.main_agent_id(owner.environment_id)
        if agent_id is None:
            return PlacedRun(request, None, True, None, owner.environment_id)
        command = StartProcess.single_part(agent_id, request.text, str(request.folder), request.kind.category, int(request.limit_seconds), kind=request.kind.value)
        process = self.bus.run(command, Actor.core(), environment_id=owner.environment_id)
        return PlacedRun(request, process.id, True, agent_id, owner.environment_id)

    def main_agent_id(self, environment_id: int) -> int | None:
        main = self.agents.environment_main_agent(environment_id)
        return None if main is None else main.id

    def admitted(self, run: PlacedRun) -> AbstractContextManager[None]:
        return self.merges.held() if run.holds_place else nullcontext()

    def ended(self, run: PlacedRun, execution: Execution) -> int | None:
        if run.environment_id is None:
            return None
        if run.process_id is None:
            self.log.append(RequestLogEntry(run.environment_id, run.agent_id, run.request.kind, run.request.text, execution.exit_code, self.clock.timestamp().text))
            return None
        printed = execution.stdout + execution.stderr
        self.outputs.write_output(run.process_id, FIRST_PART, printed)
        self.bus.run(EndProcess(run.process_id, execution.exit_code, len(printed.encode()), printed.count("\n")), Actor.core(), environment_id=run.environment_id)
        return run.process_id
