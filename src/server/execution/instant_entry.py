from typing import TypedDict
from dataclasses import dataclass

from engine.execution.execution_ticket import ExecutionTicket


# one run in the instant pool as the pool's reading shows it
InstantReading = TypedDict("InstantReading", {"line": str, "class": str, "priority": str, "starter": str, "slot_cost": int, "seconds": float,
                                              "is_running": bool, "parent_line": str})


@dataclass(frozen=True)
class InstantEntry:
    """One ticket of the instant lane as the page shows it: its place, whether it runs, what it is, who holds its
    session, and how long it has waited so far."""

    number: int
    is_running: bool
    ticket: ExecutionTicket
    owner: str
    waited_seconds: float

    def reading(self) -> InstantReading:
        parent = self.ticket.parent
        return InstantReading(**{"line": self.ticket.line, "class": self.ticket.execution_class.name, "priority": self.ticket.priority.label, "starter": self.ticket.starter.label,
                "slot_cost": self.ticket.execution_class.slot_cost,
                "seconds": self.waited_seconds, "is_running": self.is_running, "parent_line": parent.line if parent is not None else ""})

    @property
    def described(self) -> str:
        return f"{self.ticket.execution_class.name} at {self.ticket.priority.name.lower()}: {self.ticket.line}"
