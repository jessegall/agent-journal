from contextlib import AbstractContextManager, nullcontext

from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.database.database import Database
from engine.enums.process_type import ProcessType
from engine.process.door.execution import Execution
from engine.process.door.execution_request import ExecutionRequest
from engine.process.door.placed_run import PlacedRun
from engine.process.door.run_placement import RunPlacement
from engine.time.clock import Clock
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.processes.commands.end_process.end_process import EndProcess
from core.modules.processes.commands.start_process.start_process import StartProcess
from core.modules.processes.models.process import Process
from engine.query.queries import Queries
from core.modules.processes.support.output_folder import OutputFolder
from core.modules.processes.support.request_log import RequestLog
from core.modules.processes.support.request_log_entry import RequestLogEntry

FIRST_PART = 0
MERGE_WAIT_SECONDS = 3600
MERGE_POLL_SECONDS = 0.5


class ProcessRunPlacement(RunPlacement):
    """Admits a run of the journal's own through the one door. A merge waits in the long lane on its class,
    which lets one run at a time, and keeps a process row with its output, of the agent it works for
    or of the environment's main agent. Any other run is appended to the request log at its end, so
    it costs no read and no write; a tick writes the log's rows. With no environment to own it a run
    keeps no row."""

    def __init__(self, database: Database, log: RequestLog, clock: Clock, bus: Bus, agents: AgentRows, outputs: OutputFolder, queries: Queries) -> None:
        self.database, self.log, self.clock, self.bus, self.agents, self.outputs, self.queries = database, log, clock, bus, agents, outputs, queries

    def placed(self, request: ExecutionRequest) -> PlacedRun:
        owner = self.database.row_owner
        if owner is None or owner.environment_id is None:
            return PlacedRun(request, None, False)
        if request.process_type is not ProcessType.MERGE:
            return PlacedRun(request, None, False, owner.stored_agent_id, owner.environment_id, owner.is_main)
        agent_id = owner.stored_agent_id if owner.stored_agent_id is not None else self.main_agent_id(owner.environment_id)
        if agent_id is None:
            return PlacedRun(request, None, True, None, owner.environment_id)
        command = StartProcess.single_part(agent_id, request.text, str(request.folder), request.process_type.category, int(request.limit_seconds), part_category=request.process_type.value)
        process = self.bus.run(command, Actor.core(), environment_id=owner.environment_id)
        return PlacedRun(request, process.id, True, agent_id, owner.environment_id)

    def main_agent_id(self, environment_id: int) -> int | None:
        main = self.agents.environment_main_agent(environment_id)
        return None if main is None else main.id

    # a merge waits until the grant has started its row, which happens when no other merge runs
    def admitted(self, run: PlacedRun) -> AbstractContextManager[None]:
        if run.process_id is not None:
            self.clock.poll(lambda: self.is_started(run.process_id), MERGE_WAIT_SECONDS, MERGE_POLL_SECONDS)
        return nullcontext()

    def is_started(self, process_id: int) -> bool:
        return self.queries.query(Process).find(process_id).queued_at is None

    def ended(self, run: PlacedRun, execution: Execution) -> int | None:
        if run.environment_id is None:
            return None
        if run.process_id is None:
            self.log.append(RequestLogEntry(run.environment_id, run.agent_id, run.request.process_type, run.request.text, execution.exit_code, self.clock.timestamp().text))
            return None
        emitted = execution.stdout + execution.stderr
        self.outputs.write_output(run.process_id, FIRST_PART, emitted)
        self.bus.run(EndProcess(run.process_id, execution.exit_code, len(emitted.encode()), emitted.count("\n")), Actor.core(), environment_id=run.environment_id)
        return run.process_id
