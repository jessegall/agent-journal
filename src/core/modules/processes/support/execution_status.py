from core.modules.processes.support.priority_waits import PriorityWaits
from engine.enums.execution_lane import ExecutionLane
from engine.execution.execution_order import ExecutionOrder
from engine.execution.execution_ticket import ExecutionTicket
from engine.time.clock import Clock
from core.modules.processes.support.execution_tickets import ExecutionTickets
from core.modules.processes.support.run_queue_halt import RunQueueHalt
from core.modules.processes.support.run_slots import RunSlots
from core.modules.processes.support.stored_execution_classes import StoredExecutionClasses


class ExecutionStatus:
    """The short and long lanes in words a person reads: each lane's load against its capacity, what runs, and what
    waits and why, from the process rows alone, so reading it takes no write turn."""

    def __init__(self, slots: RunSlots, tickets: ExecutionTickets, classes: StoredExecutionClasses, halt: RunQueueHalt, clock: Clock, waits: PriorityWaits) -> None:
        self.slots, self.tickets, self.classes, self.halt, self.clock, self.waits = slots, tickets, classes, halt, clock, waits

    def lines(self) -> list[str]:
        limits, running = self.classes.lane_limits(), self.slots.running()
        lines: list[str] = []
        lanes = self.tickets.lanes_of_rows(running)
        for lane in (ExecutionLane.SHORT, ExecutionLane.LONG):
            lane_tickets = lanes[lane]
            used = sum(ticket.execution_class.slot_cost for ticket in lane_tickets.running)
            over = " (over capacity)" if ExecutionOrder(limits).capacity_exceeded(lane_tickets.running) else ""
            halted = " (halted)" if self.halt.is_halted and lane is ExecutionLane.LONG else ""
            lines.append(f"{lane} lane: {used} of {limits.capacity(lane)} slot units in use{over}{halted}, {len(lane_tickets.waiting)} waiting")
            lines.extend(f"  runs: {self.described(ticket)}" for ticket in lane_tickets.running)
            lines.extend(f"  waits: {self.described(ticket)}, {self.reason(ticket, lane)}" for ticket in lane_tickets.waiting)
        waited = [wait for wait in self.waits.last_hour(self.clock.timestamp()) if wait.count]
        lines.append("waits over the last hour:" if waited else "waits over the last hour: no run started")
        lines.extend(f"  {wait.described}" for wait in waited)
        return lines

    def described(self, ticket: ExecutionTicket) -> str:
        waited = ticket.entered_at.elapsed_seconds(self.clock.timestamp())
        return f"{ticket.line} ({ticket.execution_class.name}, {ticket.priority.label}, {ticket.starter.label}, {waited:.0f} s)"

    def reason(self, ticket: ExecutionTicket, lane: ExecutionLane) -> str:
        if ticket.has_open_reader_request:
            return "waits for a reader"
        if self.halt.is_halted and lane is ExecutionLane.LONG:
            return "the long lane is halted"
        return "waits for room"
