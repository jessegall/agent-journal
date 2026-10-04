from features.plans.resource import PHASE
from features.tickets.controller import Tickets
from features.tickets.worker import SHARED, worker_environment
from resources.base import Refused, SYSTEM


def start_phase_tickets(record, plan) -> list[int]:
    if not 1 <= plan.current <= len(plan.phases):
        return []
    tickets = Tickets(record, actor=SYSTEM)
    waiting = [ticket for ticket in map(tickets.load, plan.phases[plan.current - 1].get(PHASE.tickets, []))
               if not ticket.completed and not ticket.work_environment]
    if plan.worktree == SHARED:
        for ticket in waiting:
            tickets._bind_to(ticket.n, worker_environment(plan))
    return [ticket.n for ticket in waiting if started_ticket(tickets, ticket.n)]


def started_ticket(tickets, n: int) -> bool:
    try:
        tickets.start(n)
    except Refused:
        return False
    return True
