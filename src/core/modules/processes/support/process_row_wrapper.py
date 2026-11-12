from engine.enums.process_kind import ProcessKind
from engine.log.error_log import ErrorLog
from engine.process.door.request_records import RequestRecords
from engine.time.clock import Clock
from core.modules.processes.support.request_log import RequestLog
from core.modules.processes.support.request_log_entry import RequestLogEntry


class ProcessRowWrapper(RequestRecords):
    """Keeps the row of a hook, journal command or viewer request once it answered, as a run of the
    agent the request came from, or of the main agent for a person. Each is appended to the request
    log, so answering costs no write and no read, and a tick writes the log's rows. Such a row is
    priority 0: it takes no place, never moves to the background and gives no output number."""

    def __init__(self, log: RequestLog, clock: Clock, errors: ErrorLog) -> None:
        self.log, self.clock, self.errors = log, clock, errors

    def ended_now(self, kind: ProcessKind, line: str, exit_code: int) -> None:
        if self.caller is None:
            return
        actor, environment_id = self.caller
        if environment_id is None:
            return
        self.log.append(RequestLogEntry(environment_id, actor.id if actor.is_agent() else None, kind, line, exit_code, self.clock.timestamp().text))

    def recorded_hook(self, agent_id: int, environment_id: int, line: str, exit_code: int) -> None:
        self.log.append(RequestLogEntry(environment_id, agent_id, ProcessKind.HOOK, line, exit_code, self.clock.timestamp().text))

    def write_failed(self, line: str, failure: Exception) -> None:
        self.errors.recorded(["record-request", line], failure, None)
