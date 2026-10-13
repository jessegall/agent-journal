import time

from controllers.types import Boards, Tickets, Works
from declaring.trigger import MINUTE
from features.tickets.calls import calls
from framework.sending import Sent
from resources.base import SYSTEM

NUDGED = ("ticket_asks", "ticket_awaits")


def all_parked(record) -> bool:
    works = Works(record, actor=SYSTEM)
    return bool(works.rows.standing()) and not works._unparked()


def waited(ticket, now: float) -> int:
    return int((now - ticket.handed_in_at) // MINUTE)


def watched(tickets: Tickets) -> list:
    boards = tickets.orchestrating()
    if not boards:
        return []
    paused = Boards(tickets.record, actor=SYSTEM).paused()
    return [t for t in tickets.rows.standing() if t.work_environment and t.board and int(t.board) in boards and int(t.board) not in paused]


def handed_in(context, agent) -> list[Sent]:
    tickets = Tickets(context.record, actor=SYSTEM)
    return [Sent(f"{ticket.ref}|{ticket.handed_in_at}", {"ticket": ticket.n, "title": ticket.title, "waited": waited(ticket, time.time())})
            for ticket in watched(tickets) if ticket.handed_in_at]


def ticket_calls(kind: str):
    def about(context, agent) -> list[Sent]:
        tickets = Tickets(context.record, actor=SYSTEM)
        return [Sent(f"{ticket.ref}|{key}", {"ticket": ticket.n, "title": ticket.title, **values})
                for ticket in watched(tickets) for called, key, values, _ in calls(tickets, ticket) if called == kind]
    return about


def decisions(permission: str):
    def about(context, agent) -> list[Sent]:
        return [Sent(ticket.ref, {"ticket": ticket.n, "title": ticket.title})
                for ticket, waiting in Tickets(context.record, actor=SYSTEM).awaiting_decisions() if waiting == permission]
    return about


def boards_to_check(context, agent) -> list[Sent]:
    """The boards worth looking at: a board whose tickets are all waiting has no agent to check, and asking every five minutes costs the orchestrator a turn each time for nothing."""
    tickets = Tickets(context.record, actor=SYSTEM)
    running = {int(ticket.board) for ticket in tickets.running() if ticket.board}
    boards = [n for n in tickets.orchestrating() if n in running]
    if not boards or all_parked(context.record):
        return []
    if agent.idle_for < float(context.feature.cadence(context.record, "board check").every) * MINUTE:
        return []
    return [Sent(",".join(map(str, boards)), {"about": ", ".join(f"board {n}" for n in boards)})]
