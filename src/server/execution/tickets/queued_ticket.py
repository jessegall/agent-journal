from collections.abc import Callable
from dataclasses import dataclass
from engine.execution.execution_ticket import ExecutionTicket


@dataclass
class QueuedTicket:
    """A ticket in the instant lane with its place, the session that owns it and whether its client still waits."""

    number: int
    ticket: ExecutionTicket
    owner: str
    entered_at: float
    is_client_waiting: Callable[[], bool]
