from collections.abc import Generator
from contextlib import contextmanager

from engine.time.clock import Clock
from server.execution.execution_priorities import ExecutionPriorities
from server.execution.execution_queue import ExecutionQueue


class RoundTickets:
    """The instant lane tickets of the server's background work: one for each tick handler run and one for each
    event a listener round handles, at background, so hooks, commands and viewer requests go first and at most a
    few background tickets run at once."""

    def __init__(self, queue: ExecutionQueue, priorities: ExecutionPriorities, clock: Clock) -> None:
        self.queue, self.priorities, self.clock = queue, priorities, clock

    @contextmanager
    def tick_turn(self, handler_name: str) -> Generator[None]:
        with self.queue.admitted(self.priorities.tick_ticket(handler_name, self.clock.timestamp())):
            yield

    @contextmanager
    def event_turn(self, event_name: str) -> Generator[None]:
        with self.queue.admitted(self.priorities.event_ticket(event_name, self.clock.timestamp())):
            yield
