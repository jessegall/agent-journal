from collections.abc import Generator
from contextlib import contextmanager
from dataclasses import replace

from engine.database.database import Database
from engine.database.write_turns import WriteTurns
from engine.enums.execution_lane import ExecutionLane
from engine.enums.execution_priority import ExecutionPriority
from engine.enums.log_level import LogLevel
from engine.enums.log_source import LogSource
from engine.execution.execution_order import ExecutionOrder
from engine.execution.limits.default_lane_limits import DEFAULT_LANE_LIMITS
from engine.execution.limits.lane_limits import LaneLimits
from engine.journal.journal_home import JournalHome
from engine.log.system_log_writer import SystemLogWriter
from engine.time.clock import Clock
from server.execution.command_tickets import CommandTickets
from server.execution.execution_priorities import ExecutionPriorities
from server.execution.execution_queue import ExecutionQueue
from server.execution.hook_tickets import HookTickets
from server.execution.session_starters import SessionStarters
from server.execution.viewer_tickets import ViewerTickets

CLOSE_WAIT_SECONDS = 60.0
VIEWER_WAIT_LIMIT_SECONDS = 1.0
INSTANT_CAPACITY = DEFAULT_LANE_LIMITS.capacity(ExecutionLane.INSTANT)


# a session runs one hook at a time, so the instant lane needs no share per starter on top of that
def instant_limits(capacity: int) -> LaneLimits:
    capacities = {**DEFAULT_LANE_LIMITS.capacities, ExecutionLane.INSTANT: capacity}
    return replace(DEFAULT_LANE_LIMITS.with_capacities(capacities), starter_caps=dict(capacities))


class HookDatabase:
    """The database connections hooks use, one per running hook, made as the instant lane needs them; a hook takes
    its place in the instant lane, the main agent's at once, a session's one at a time."""

    def __init__(self, home: JournalHome, turns: WriteTurns | None = None, instant_capacity: int = INSTANT_CAPACITY) -> None:
        self.home, self.turns = home, turns
        self.databases = [Database.shared(home, turns)]
        self.free_databases = list(self.databases)
        self.instant_capacity = instant_capacity
        log = SystemLogWriter(home, Clock())
        self.executions = ExecutionQueue(ExecutionOrder(instant_limits(instant_capacity)), Clock(), lambda text: log.write(LogLevel.WARNING, f"an execution failed: {text}", LogSource.SERVER))
        priorities = ExecutionPriorities(SessionStarters.shared(home))
        self.viewer_tickets = ViewerTickets(self.executions, priorities, Clock(), VIEWER_WAIT_LIMIT_SECONDS)
        self.hook_tickets, self.command_tickets = HookTickets(self.executions, Clock()), CommandTickets(self.executions, priorities, Clock())

    @contextmanager
    def used(self, priority: ExecutionPriority, wait_seconds: float, owner: str = "", event_name: str = "hook") -> Generator[Database]:
        with self.hook_tickets.admitted(priority, wait_seconds, owner, event_name):
            database = self.free_database()
            busy_timeout_seconds = database.busy_timeout_seconds()
            try:
                yield database
            finally:
                database.set_busy_timeout(busy_timeout_seconds)
                self.free_databases.append(database)

    # a connection is made the first time this many hooks run at once, and kept for the next
    def free_database(self) -> Database:
        if self.free_databases:
            return self.free_databases.pop()
        database = Database.shared(self.home, self.turns)
        self.databases.append(database)
        return database

    def close(self) -> None:
        self.executions.wait_idle(CLOSE_WAIT_SECONDS)
        for database in self.databases:
            database.close()
