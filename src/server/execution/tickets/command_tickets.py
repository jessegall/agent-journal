from collections.abc import Generator
from contextlib import contextmanager

from engine.execution.current_execution import CurrentExecution
from engine.time.clock import Clock
from server.execution.execution_priorities import ExecutionPriorities
from server.execution.execution_queue import ExecutionQueue


class CommandTickets:
    """A journal command's ticket of the instant lane at its asker's priority; its writes wait with that priority.
    It takes no place of its session, so a long command, such as a dispatch cutting a worktree or a plugin upgrade
    fetching, never holds up that session's hooks and other commands."""

    def __init__(self, queue: ExecutionQueue, priorities: ExecutionPriorities, clock: Clock) -> None:
        self.queue, self.priorities, self.clock = queue, priorities, clock

    @contextmanager
    def admitted(self, session: str, line: str) -> Generator[None]:
        ticket = self.priorities.command_ticket(session, line, self.clock.timestamp())
        with self.queue.admitted(ticket) as queued, CurrentExecution(queued.ticket.priority, "command", line, queued.ticket).applied():
            yield
