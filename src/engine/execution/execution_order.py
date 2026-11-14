from collections import Counter
from collections.abc import Sequence
from dataclasses import replace

from engine.enums.execution_priority import ExecutionPriority
from engine.execution.execution_starter import ExecutionStarter
from engine.execution.execution_ticket import ExecutionTicket
from engine.execution.limits.lane_limits import LaneLimits
from engine.execution.limits.occupied_slots import OccupiedSlots
from engine.time.timestamp import Timestamp


class ExecutionOrder:
    """Decides which waiting tickets of one lane start now, by room, priority, limits and longest waits: pure, it
    keeps nothing and reads no clock."""

    def __init__(self, limits: LaneLimits) -> None:
        self.limits = limits

    def starting(self, waiting: Sequence[ExecutionTicket], running: Sequence[ExecutionTicket], current_time: Timestamp,
                 is_halted: bool) -> tuple[ExecutionTicket, ...]:
        occupied_slots, started = OccupiedSlots.counted(running), list[ExecutionTicket]()
        running_now = list(running)
        for ticket in sorted(self.raised(waiting, current_time, is_halted), key=lambda ticket: self.place(ticket, current_time)):
            if not self.may_start(ticket, occupied_slots, running_now, is_halted):
                continue
            occupied_slots = occupied_slots.with_ticket(ticket)
            running_now.append(ticket)
            started.append(ticket)
        return tuple(started)

    # a ticket that waited its step's longest wait goes up one step, and waits again from that moment; never into
    # immediate, and a halted lane counts no wait
    def raised(self, waiting: Sequence[ExecutionTicket], current_time: Timestamp, is_halted: bool) -> tuple[ExecutionTicket, ...]:
        if is_halted:
            return tuple(waiting)
        return tuple(self.raised_ticket(ticket, current_time) for ticket in waiting)

    def raised_ticket(self, ticket: ExecutionTicket, current_time: Timestamp) -> ExecutionTicket:
        while ticket.priority < ExecutionPriority.RESERVED:
            wait = self.longest_wait(ticket)
            if ticket.raised_at.elapsed_seconds(current_time) < wait:
                return ticket
            ticket = replace(ticket, priority=ticket.priority.raised(), raised_at=ticket.raised_at.plus_seconds(wait))
        return ticket

    def longest_wait(self, ticket: ExecutionTicket) -> float:
        return self.limits.priority_limit(ticket.execution_class.lane, ticket.priority).longest_wait_seconds

    def capacity_exceeded(self, running: Sequence[ExecutionTicket]) -> bool:
        if not running:
            return False
        return OccupiedSlots.counted(running).slot_units > self.limits.capacity(running[0].execution_class.lane)

    # immediate tickets are never refused; past the ceiling the caller writes one line
    def over_ceiling(self, running: Sequence[ExecutionTicket]) -> bool:
        return sum(1 for ticket in running if ticket.priority.is_unlimited) > self.limits.immediate_ceiling

    # a reserved ticket past its longest wait takes the next room before anything but immediate
    def place(self, ticket: ExecutionTicket, current_time: Timestamp) -> tuple[int, int, Timestamp]:
        is_overdue = ticket.priority is ExecutionPriority.RESERVED and ticket.raised_at.elapsed_seconds(current_time) >= self.longest_wait(ticket)
        return -ticket.priority, 0 if is_overdue else 1, ticket.entered_at

    def may_start(self, ticket: ExecutionTicket, occupied_slots: OccupiedSlots, running: Sequence[ExecutionTicket], is_halted: bool) -> bool:
        if ticket.priority.is_unlimited:
            return True
        if is_halted or ticket.has_open_reader_request or self.is_class_full(ticket, running):
            return False
        lane, cost = ticket.execution_class.lane, ticket.execution_class.slot_cost
        has_room = occupied_slots.slot_units + cost <= self.limits.capacity(lane)
        running_limit = self.limits.priority_limit(lane, ticket.first_priority).running_limit
        is_under_priority_limit = self.fits(occupied_slots.first_priority_units(ticket.first_priority), cost, running_limit)
        return has_room and is_under_priority_limit and self.is_under_starter_cap(ticket, running)

    @staticmethod
    def is_class_full(ticket: ExecutionTicket, running: Sequence[ExecutionTicket]) -> bool:
        return sum(1 for other in running if other.execution_class.name == ticket.execution_class.name) >= ticket.execution_class.class_limit

    def is_under_starter_cap(self, ticket: ExecutionTicket, running: Sequence[ExecutionTicket]) -> bool:
        held: Counter[ExecutionStarter] = Counter()
        for other in running:
            held[other.starter] += other.execution_class.slot_cost
        return self.fits(held[ticket.starter], ticket.execution_class.slot_cost, self.limits.starter_cap(ticket.execution_class.lane))

    # a limit caps what a starter or a priority piles up: with nothing running one run may always start, even one
    # costing more than its share, and a run that costs nothing piles nothing up
    @staticmethod
    def fits(held: int, cost: int, limit: int) -> bool:
        return held == 0 or cost == 0 or held + cost <= limit
