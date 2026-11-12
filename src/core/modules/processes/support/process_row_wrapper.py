from engine.database.database import Database
from engine.enums.process_kind import ProcessKind
from engine.process.door.request_records import RequestRecords
from engine.time.clock import Clock
from core.modules.processes.support.request_log import RequestLog
from core.modules.processes.support.request_log_entry import RequestLogEntry


class ProcessRowWrapper(RequestRecords):
    """Keeps the row of a hook, journal command or viewer request once it answered. Each is appended to the request log,
    so answering costs no write and no read, and a tick writes the log's rows. Such a row is priority 0: it takes no place, never moves to the
    background and gives no output number."""

    def __init__(self, database: Database, log: RequestLog, clock: Clock) -> None:
        self.database, self.log, self.clock = database, log, clock

    def ended_now(self, kind: ProcessKind, line: str, exit_code: int) -> None:
        owner = self.database.row_owner
        if owner is None or owner.environment_id is None:
            return
        self.log.append(RequestLogEntry(owner.environment_id, owner.stored_agent_id, kind, line, exit_code, self.clock.timestamp().text))

    def recorded_hook(self, agent_id: int, environment_id: int, line: str, exit_code: int) -> None:
        self.log.append(RequestLogEntry(environment_id, agent_id, ProcessKind.HOOK, line, exit_code, self.clock.timestamp().text))
