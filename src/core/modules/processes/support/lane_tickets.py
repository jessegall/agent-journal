from dataclasses import dataclass

from engine.execution.execution_ticket import ExecutionTicket


@dataclass(frozen=True)
class LaneTickets:
    """The tickets of one lane: those that wait for room and those that run."""

    waiting: tuple[ExecutionTicket, ...] = ()
    running: tuple[ExecutionTicket, ...] = ()
