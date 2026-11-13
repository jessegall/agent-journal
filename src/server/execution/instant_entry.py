from dataclasses import dataclass

from engine.execution.execution_ticket import ExecutionTicket


@dataclass(frozen=True)
class InstantEntry:
    """One ticket of the instant lane as the page shows it: its place, whether it runs, what it is, who holds its
    session, and how long it has waited so far."""

    number: int
    is_running: bool
    ticket: ExecutionTicket
    owner: str
    waited_seconds: float

    @property
    def described(self) -> str:
        return f"{self.ticket.execution_class.name} at {self.ticket.priority.name.lower()}: {self.ticket.line}"
