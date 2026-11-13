from collections.abc import Sequence

from engine.execution.execution_ticket import ExecutionTicket
from engine.execution.lane_limits import LaneLimits
from engine.execution.occupied_slots import OccupiedSlots
from engine.time.timestamp import Timestamp


class ExecutionOrder:
    """Decides which waiting tickets of one lane start now, by room, priority, limits and longest waits."""

    def __init__(self, limits: LaneLimits) -> None:
        self.limits = limits

    def starting(self, waiting: Sequence[ExecutionTicket], running: Sequence[ExecutionTicket], current_time: Timestamp,
                 is_halted: bool) -> tuple[ExecutionTicket, ...]:
        occupied_slots = OccupiedSlots.counted(running)
        started: list[ExecutionTicket] = []
        for ticket in sorted(waiting, key=self.place):
            if not self.may_start(ticket, occupied_slots, is_halted):
                continue
            occupied_slots = occupied_slots.with_ticket(ticket)
            started.append(ticket)
        return tuple(started)

    def capacity_exceeded(self, running: Sequence[ExecutionTicket]) -> bool:
        if not running:
            return False
        return OccupiedSlots.counted(running).slot_units > self.limits.capacity(running[0].execution_class.lane)

    @staticmethod
    def place(ticket: ExecutionTicket) -> tuple[int, Timestamp]:
        return -ticket.priority, ticket.entered_at

    def may_start(self, ticket: ExecutionTicket, occupied_slots: OccupiedSlots, is_halted: bool) -> bool:
        if ticket.priority.is_unlimited:
            return True
        if is_halted:
            return False
        lane, cost = ticket.execution_class.lane, ticket.execution_class.slot_cost
        has_room = occupied_slots.slot_units + cost <= self.limits.capacity(lane)
        running_limit = self.limits.priority_limit(lane, ticket.first_priority).running_limit
        return has_room and occupied_slots.first_priority_units(ticket.first_priority) + cost <= running_limit
