from core.modules.processes.support.pool_entry import PoolEntry
from core.modules.processes.support.execution_overview import ExecutionOverview
from core.modules.processes.support.pool_load import PoolLoad
from engine.journal.journal_home import JournalHome
from engine.execution.instant_pool_reading import InstantPoolReading
from core.modules.processes.support.priority_waits import PriorityWaits
from engine.enums.execution_length import ExecutionLength
from engine.execution.execution_order import ExecutionOrder
from engine.execution.execution_ticket import ExecutionTicket
from engine.time.clock import Clock
from core.modules.processes.support.execution_tickets import ExecutionTickets
from core.modules.processes.support.run_queue_halt import RunQueueHalt
from core.modules.processes.support.run_slots import RunSlots
from core.modules.processes.support.stored_execution_classes import StoredExecutionClasses


class ExecutionStatus:
    """The instant, short and long lanes as a person reads them: each lane's load against its capacity,
    what runs, what waits and why, and the waits of the last hour; the instant lane as the server holds it
    and the others from the process rows, so reading it takes no write turn."""

    def __init__(self, slots: RunSlots, tickets: ExecutionTickets, classes: StoredExecutionClasses, halt: RunQueueHalt, clock: Clock, waits: PriorityWaits, home: JournalHome) -> None:
        self.slots, self.tickets, self.classes, self.halt, self.clock, self.waits, self.home = slots, tickets, classes, halt, clock, waits, home

    def lines(self) -> list[str]:
        return self.snapshot().lines()

    def snapshot(self) -> ExecutionOverview:
        return ExecutionOverview(tuple(self.pools()), tuple(self.waits.last_hour(self.clock.timestamp())))

    # the instant lane as the server holds it, then the short and long lanes from the process rows
    def pools(self) -> list[PoolLoad]:
        limits, running = self.classes.pool_limits(), self.slots.running()
        pools = self.tickets.row_pools(running)
        categories = {process.id: process.plugin or process.category.value for process in running}
        loads = [self.instant_pool()]
        for pool in (ExecutionLength.SHORT, ExecutionLength.LONG):
            pool_tickets = pools[pool]
            is_halted = self.halt.is_halted and pool is ExecutionLength.LONG
            loads.append(PoolLoad(pool.value, sum(ticket.execution_class.slot_cost for ticket in pool_tickets.running), limits.capacity(pool),
                                  ExecutionOrder(limits).capacity_exceeded(pool_tickets.running),
                                  tuple(self.entry(ticket, categories[ticket.run_id]) for ticket in pool_tickets.running),
                                  tuple(self.entry(ticket, categories[ticket.run_id], self.reason(ticket, pool)) for ticket in pool_tickets.waiting),
                                  self.halt.halt_type if is_halted else "", self.halt.reason if is_halted else ""))
        return loads

    def instant_pool(self) -> PoolLoad:
        loading = InstantPoolReading.shared(self.home)
        entries = [(bool(entry["is_running"]), PoolEntry(str(entry["line"]), str(entry["class"]), str(entry["priority"]), str(entry["starter"]), float(str(entry["seconds"])),
                                                         int(str(entry["slot_cost"])), str(entry["class"]),
                                                         reason="" if entry["is_running"] else "waits for room", parent_line=str(entry["parent_line"]))) for entry in loading.entries()]
        running = tuple(entry for is_running, entry in entries if is_running)
        return PoolLoad(ExecutionLength.INSTANT.value, sum(entry.slot_cost for entry in running), loading.capacity, running=running, waiting=tuple(entry for is_running, entry in entries if not is_running))

    def entry(self, ticket: ExecutionTicket, kind: str, reason: str = "") -> PoolEntry:
        raised = ticket.first_priority.label if ticket.priority != ticket.first_priority else ""
        return PoolEntry(ticket.line, ticket.execution_class.name, ticket.priority.label, ticket.starter.label, ticket.entered_at.elapsed_seconds(self.clock.timestamp()),
                         ticket.execution_class.slot_cost, kind, ticket.run_id, reason, raised)

    def reason(self, ticket: ExecutionTicket, pool: ExecutionLength) -> str:
        if ticket.has_open_reader_request:
            return "waits for a reader"
        if self.halt.is_halted and pool is ExecutionLength.LONG:
            return "the long lane is paused"
        return "waits for room"
