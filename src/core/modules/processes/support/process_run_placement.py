from engine.database.database import Database
from engine.process.door.execution import Execution
from engine.process.door.execution_request import ExecutionRequest
from engine.process.door.placed_run import PlacedRun
from engine.process.door.run_placement import RunPlacement
from engine.time.clock import Clock
from core.modules.processes.support.request_log import RequestLog
from core.modules.processes.support.request_log_entry import RequestLogEntry


class ProcessRunPlacement(RunPlacement):
    """Admits a run of the journal's own through the one door: its end is appended to the request log as a run of
    the agent the request works for, or of the environment's main agent, so a run costs no read and no write; a
    tick writes the log's rows. With no environment to own it the run keeps no row."""

    def __init__(self, database: Database, log: RequestLog, clock: Clock) -> None:
        self.database, self.log, self.clock = database, log, clock

    def placed(self, request: ExecutionRequest) -> PlacedRun:
        owner = self.database.row_owner
        if owner is None or owner.environment_id is None:
            return PlacedRun(request, None, False)
        return PlacedRun(request, None, False, owner.stored_agent_id, owner.environment_id)

    def ended(self, run: PlacedRun, execution: Execution) -> int | None:
        if run.environment_id is None:
            return None
        self.log.append(RequestLogEntry(run.environment_id, run.agent_id, run.request.kind, run.request.text, execution.exit_code, self.clock.timestamp().text))
        return None
