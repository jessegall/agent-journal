from core.modules.processes.support.lane_load import ExecutionSnapshot, LaneEntry, LaneLoad
from engine.journal.journal_home import JournalHome
from engine.execution.instant_lane_reading import InstantLaneReading
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
    """The instant, short and long lanes as a person reads them: each lane's load against its capacity, what runs,
    what waits and why, and the waits of the last hour; the instant lane as the server holds it and the others from
    the process rows, so reading it takes no write turn."""

    def __init__(self, slots: RunSlots, tickets: ExecutionTickets, classes: StoredExecutionClasses, halt: RunQueueHalt, clock: Clock, waits: PriorityWaits, home: JournalHome) -> None:
        self.slots, self.tickets, self.classes, self.halt, self.clock, self.waits, self.home = slots, tickets, classes, halt, clock, waits, home

    def lines(self) -> list[str]:
        return self.snapshot().lines()

    def snapshot(self) -> ExecutionSnapshot:
        return ExecutionSnapshot(tuple(self.lanes()), tuple(self.waits.last_hour(self.clock.timestamp())))

    # the instant lane as the server holds it, then the short and long lanes from the process rows
    def lanes(self) -> list[LaneLoad]:
        limits, running = self.classes.lane_limits(), self.slots.running()
        lanes = self.tickets.lanes_of_rows(running)
        loads = [self.instant_lane()]
        for lane in (ExecutionLane.SHORT, ExecutionLane.LONG):
            lane_tickets = lanes[lane]
            is_halted = self.halt.is_halted and lane is ExecutionLane.LONG
            loads.append(LaneLoad(lane.value, sum(ticket.execution_class.slot_cost for ticket in lane_tickets.running), limits.capacity(lane),
                                  ExecutionOrder(limits).capacity_exceeded(lane_tickets.running), is_halted,
                                  tuple(self.entry(ticket) for ticket in lane_tickets.running), tuple(self.entry(ticket, self.reason(ticket, lane)) for ticket in lane_tickets.waiting)))
        return loads

    def instant_lane(self) -> LaneLoad:
        reading = InstantLaneReading.shared(self.home)
        entries = [(bool(entry["is_running"]), LaneEntry(str(entry["line"]), str(entry["class"]), str(entry["priority"]), str(entry["starter"]), float(str(entry["seconds"])),
                                                         "" if entry["is_running"] else "waits for room", parent_line=str(entry["parent_line"]))) for entry in reading.entries()]
        running = tuple(entry for is_running, entry in entries if is_running)
        return LaneLoad(ExecutionLane.INSTANT.value, len(running), reading.capacity, running=running, waiting=tuple(entry for is_running, entry in entries if not is_running))

    def entry(self, ticket: ExecutionTicket, reason: str = "") -> LaneEntry:
        raised_from = ticket.first_priority.label if ticket.priority != ticket.first_priority else ""
        return LaneEntry(ticket.line, ticket.execution_class.name, ticket.priority.label, ticket.starter.label, ticket.entered_at.elapsed_seconds(self.clock.timestamp()), reason, raised_from)

    def reason(self, ticket: ExecutionTicket, lane: ExecutionLane) -> str:
        if ticket.has_open_reader_request:
            return "waits for a reader"
        if self.halt.is_halted and lane is ExecutionLane.LONG:
            return "the long lane is halted"
        return "waits for room"
