from collections.abc import Generator
from contextlib import ExitStack, contextmanager

from engine.enums.window_priority import WindowPriority
from engine.execution.current_execution import CurrentExecution
from engine.time.clock import Clock
from server.errors.hook_database_busy_error import HookDatabaseBusyError
from server.execution.execution_priorities import ExecutionPriorities
from server.execution.execution_queue import ExecutionQueue


class ViewerTickets:
    """A viewer request's ticket of the instant lane, at its window's priority: the first window at once, the rest
    in the lane's order. A request that waits past its limit runs all the same, as a viewer request always has."""

    def __init__(self, queue: ExecutionQueue, priorities: ExecutionPriorities, clock: Clock, wait_limit_seconds: float) -> None:
        self.queue, self.priorities, self.clock, self.wait_limit_seconds = queue, priorities, clock, wait_limit_seconds

    @contextmanager
    def admitted(self, line: str, window: WindowPriority, is_hidden: bool = False) -> Generator[None]:
        ticket = self.priorities.viewer_ticket(line, window, self.clock.timestamp(), is_hidden)
        with ExitStack() as held:
            try:
                ticket = held.enter_context(self.queue.admitted(ticket, wait_limit_seconds=self.wait_limit_seconds)).ticket
            except HookDatabaseBusyError:
                pass
            with CurrentExecution(ticket.priority, "viewer", line, ticket).applied():
                yield
