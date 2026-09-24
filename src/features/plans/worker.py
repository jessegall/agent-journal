from features.plans.resource import PHASE
from features.tickets.launch import start_agent_in
from resources.base import Refused, SYSTEM


def worker_environment(plan) -> str:
    return f"plan-{plan.n}"


def kickoff(plan) -> str:
    return (f"You are the worker agent of plan {plan.n}, {plan.title}, with this environment and a worktree of your own. Its phases "
            f"hold board tickets, and the journal starts each phase's tickets once the phase before is done. You orchestrate: "
            f"follow the plan (journal plan show {plan.n}) and its tickets (journal ticket show <n>), answer their agents when "
            f"they ask, check each ticket's result against its phase's complete-when line, and when a phase is stuck, say so to "
            f"the user in the chat. Do not do the tickets' own work.")


def start_worker(record, plan) -> str:
    if not any(phase.get(PHASE.tickets) for phase in plan.phases):
        return ""
    name = worker_environment(plan)
    return start_agent_in(record, name, name, f"Where the worker agent of plan {plan.n} orchestrates it", plan.ref, kickoff(plan))


def start_phase_tickets(record, plan) -> list[int]:
    from features.tickets.controller import Tickets
    if not 1 <= plan.current <= len(plan.phases):
        return []
    tickets = Tickets(record, actor=SYSTEM)
    waiting = [ticket for ticket in map(tickets.load, plan.phases[plan.current - 1].get(PHASE.tickets, []))
               if not ticket.completed and not ticket.work_environment]
    return [ticket.n for ticket in waiting if started_ticket(tickets, ticket.n)]


def started_ticket(tickets, n: int) -> bool:
    try:
        tickets.start(n)
    except Refused:
        return False
    return True
