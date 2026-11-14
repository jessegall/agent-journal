from collections.abc import Generator
from contextlib import contextmanager

from engine.enums.execution_lane import ExecutionLane
from engine.enums.execution_priority import ExecutionPriority
from engine.enums.starter_type import StarterType
from engine.execution.classes.execution_class import ExecutionClass
from engine.execution.current_execution import HOOK_CLASS, CurrentExecution
from engine.execution.execution_starter import ExecutionStarter
from engine.execution.execution_ticket import ExecutionTicket
from engine.time.clock import Clock
from server.execution.execution_queue import ExecutionQueue


class HookTickets:
    """A hook's ticket of the instant lane: the main agent's at once, a session's one at a time, refused past its
    wait; its writes wait with its priority."""

    def __init__(self, queue: ExecutionQueue, clock: Clock) -> None:
        self.queue, self.clock = queue, clock

    @contextmanager
    def admitted(self, priority: ExecutionPriority, wait_seconds: float, owner: str, event_name: str) -> Generator[None]:
        with self.queue.admitted(self.ticket(priority, event_name), owner, wait_seconds) as queued, \
                CurrentExecution(queued.ticket.priority, HOOK_CLASS, queued.ticket.line, queued.ticket).applied():
            yield

    def ticket(self, priority: ExecutionPriority, event_name: str) -> ExecutionTicket:
        starter = ExecutionStarter(StarterType.MAIN_AGENT if priority.is_unlimited else StarterType.HELPER)
        entered_at = self.clock.timestamp()
        execution_class = ExecutionClass("main agent hook" if priority.is_unlimited else "agent hook", ExecutionLane.INSTANT, 1, priority)
        return ExecutionTicket(execution_class, priority, priority, starter, event_name, entered_at, entered_at)
