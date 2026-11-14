from engine.execution.current_execution import CurrentExecution
from collections.abc import Generator
from contextlib import contextmanager, nullcontext
from dataclasses import replace

from engine.enums.execution_priority import ExecutionPriority
from engine.execution.held_write_turn import HELD_WRITE_TURN
from engine.process.door.placed_run import PlacedRun
from engine.time.clock import Clock
from server.execution.execution_priorities import ExecutionPriorities
from server.execution.execution_queue import ExecutionQueue


class TicketAdmission:
    """The server's tickets for the journal's own runs: a merge waits in the long lane as its row, every other run
    takes a short lane ticket of the journal's own class for as long as it runs. A run of a hook or command is its
    waited child, listed under it and started at once; a run asked for inside a write turn starts at once too, since
    its wait would hold every other writer."""

    def __init__(self, queue: ExecutionQueue, priorities: ExecutionPriorities, clock: Clock) -> None:
        self.queue, self.priorities, self.clock = queue, priorities, clock

    @contextmanager
    def admitted(self, run: PlacedRun) -> Generator[None]:
        if run.process_id is not None:
            with nullcontext():
                yield
            return
        ticket = self.priorities.journal_run_ticket(run.request.text, self.clock.timestamp())
        parent = CurrentExecution.read().ticket
        if parent is not None:
            ticket = parent.waited_child(ticket.execution_class, ticket.line, ticket.entered_at)
        elif HELD_WRITE_TURN.is_held:
            ticket = replace(ticket, priority=ExecutionPriority.IMMEDIATE)
        with self.queue.admitted(ticket):
            yield
