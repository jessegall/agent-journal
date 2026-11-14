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

    def reading(self) -> dict[str, object]:
        parent = self.ticket.parent
        return {"line": self.ticket.line, "class": self.ticket.execution_class.name, "priority": self.ticket.priority.label, "starter": self.ticket.starter.label,
                "seconds": self.waited_seconds, "is_running": self.is_running, "parent_line": parent.line if parent is not None else ""}

    @property
    def described(self) -> str:
        return f"{self.ticket.execution_class.name} at {self.ticket.priority.name.lower()}: {self.ticket.line}"
