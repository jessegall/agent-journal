from collections.abc import Generator
from contextlib import contextmanager
from dataclasses import replace

from engine.database.database import Database
from engine.database.write_turns import WriteTurns
from engine.enums.execution_lane import ExecutionLane
from engine.enums.execution_priority import ExecutionPriority
from engine.enums.starter_type import StarterType
from engine.execution.default_lane_limits import DEFAULT_LANE_LIMITS
from engine.execution.execution_class import ExecutionClass
from engine.execution.execution_order import ExecutionOrder
from engine.execution.execution_starter import ExecutionStarter
from engine.execution.execution_ticket import ExecutionTicket
from engine.journal.journal_home import JournalHome
from engine.time.clock import Clock
from server.execution.execution_queue import ExecutionQueue
from server.hook.queue_request import QueueRequest
from server.hook.server_queue import RUNNING_HOOKS_COUNT, ServerQueue

CLOSE_WAIT_SECONDS = 60.0
# a session runs one hook at a time, so the instant lane needs no share per starter on top of that
INSTANT_LIMITS = replace(DEFAULT_LANE_LIMITS, starter_caps={lane: capacity for lane, capacity in DEFAULT_LANE_LIMITS.capacities.items()})


class HookDatabase:
    """The database connections hooks use, one per running hook, made as the instant lane needs them; a hook takes
    its place in the instant lane, the main agent's at once, a session's one at a time."""

    def __init__(self, home: JournalHome, turns: WriteTurns | None = None, running_hooks_count: int = RUNNING_HOOKS_COUNT) -> None:
        self.home, self.turns = home, turns
        self.databases = [Database.shared(home, turns) for _ in range(running_hooks_count)]
        self.free_databases = list(self.databases)
        self.queue = ServerQueue(running_hooks_count)
        self.executions = ExecutionQueue(ExecutionOrder(INSTANT_LIMITS), Clock())

    @contextmanager
    def used(self, priority: ExecutionPriority, wait_seconds: float, owner: str = "", request: QueueRequest | None = None) -> Generator[Database]:
        with self.executions.admitted(self.hook_ticket(priority, request), owner, wait_seconds), self.queue.observing(request or QueueRequest.started("hook", "hook", owner)):
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

    def hook_ticket(self, priority: ExecutionPriority, request: QueueRequest | None) -> ExecutionTicket:
        starter = ExecutionStarter(StarterType.MAIN_AGENT if priority.is_unlimited else StarterType.HELPER)
        entered_at = Clock().timestamp()
        execution_class = ExecutionClass("main agent hook" if priority.is_unlimited else "agent hook", ExecutionLane.INSTANT, 1, priority)
        return ExecutionTicket(execution_class, priority, priority, starter, request.event if request is not None else "hook", entered_at, entered_at)

    def close(self) -> None:
        self.executions.wait_idle(CLOSE_WAIT_SECONDS)
        self.queue.wait_idle(CLOSE_WAIT_SECONDS)
        for database in self.databases:
            database.close()
