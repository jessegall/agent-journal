from collections.abc import Generator
from contextlib import contextmanager

from engine.execution.current_execution import CurrentExecution
from engine.time.clock import Clock
from server.execution.execution_priorities import ExecutionPriorities
from server.execution.execution_queue import ExecutionQueue


class CommandTickets:
    """A journal command's ticket of the instant lane at its asker's priority, its session's one at a time; its
    writes wait with that priority."""

    def __init__(self, queue: ExecutionQueue, priorities: ExecutionPriorities, clock: Clock) -> None:
        self.queue, self.priorities, self.clock = queue, priorities, clock

    @contextmanager
    def admitted(self, session: str, line: str) -> Generator[None]:
        ticket = self.priorities.command_ticket(session, line, self.clock.timestamp())
        with self.queue.admitted(ticket, session) as queued, CurrentExecution(queued.ticket.priority, "command", line, queued.ticket).applied():
            yield
