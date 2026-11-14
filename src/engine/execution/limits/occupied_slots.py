from collections import Counter
from collections.abc import Sequence
from dataclasses import dataclass, field

from engine.enums.execution_priority import ExecutionPriority
from engine.execution.execution_ticket import ExecutionTicket


@dataclass(frozen=True)
class OccupiedSlots:
    """The slot units the running tickets of one lane hold, in all and per first priority."""

    slot_units: int = 0
    priority_units: Counter[ExecutionPriority] = field(default_factory=Counter)

    @classmethod
    def counted(cls, running: Sequence[ExecutionTicket]) -> "OccupiedSlots":
        occupied_slots = cls()
        for ticket in running:
            occupied_slots = occupied_slots.with_ticket(ticket)
        return occupied_slots

    def with_ticket(self, ticket: ExecutionTicket) -> "OccupiedSlots":
        cost = ticket.execution_class.slot_cost
        return OccupiedSlots(self.slot_units + cost, self.priority_units + Counter({ticket.first_priority: cost}))

    def first_priority_units(self, priority: ExecutionPriority) -> int:
        return self.priority_units[priority]
