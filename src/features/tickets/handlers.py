from dataclasses import dataclass
from typing import ClassVar

from engine.events.engine import ClockTicked
from engine.events.resources import QuestionAnswered, ResourceCreated, ResourceEvent
from features.sending import Sent
from features.trigger import MINUTE, MINUTES, Trigger
from features.parts import WHOLE_FEATURE, AgentContext, Context, Handler
from controllers.types import Questions, Works
from features.plans.controller import WAITING
from features.boards.controller import Boards
from features.tickets.calls import PLAN_DONE_CALL, calls
from features.tickets.controller import HELD, Tickets
from resources.base import CHECKPOINT, FINISHED, PLAN_WAITS, STUCK, SYSTEM, Refused

NUDGED = ("ticket_asks", "ticket_awaits")
PLAN_WAITS_ONCE = "plan_waits"
ATTENTION_EVERY = "ticket_attention"
LOOK_AGAIN = 15


def all_parked(record) -> bool:
    works = Works(record, actor=SYSTEM)
    return bool(works.rows.standing()) and not works._unparked()


class LookAfterTickets(Handler):
    behaviour = WHOLE_FEATURE

    def handle(self, context: AgentContext, event: ClockTicked) -> None:
        tickets = Tickets(context.record, actor=SYSTEM)
        tickets.mark_seen()
        tickets.keep_branches()
        tickets.close_merged()
        tickets.start_queued()
        tickets._stop_orphaned()
        raise_waiting_plans(context, tickets)
        pass_on_calls(context, tickets)
        look_at_stuck(context, tickets)


def raise_waiting_plans(context: AgentContext, tickets: Tickets) -> None:
    paused = Boards(context.record, actor=SYSTEM).paused()
    for ticket in [t for t in tickets._awaiting_orchestrator() if not (t.board and int(t.board) in paused)]:
        plan = tickets._plans(ticket).load(ticket.plan)
        if context.once(PLAN_WAITS_ONCE, f"{ticket.ref}|{ticket.plan}|{plan.updated}"):
            tickets.raise_moment(ticket.n, CHECKPOINT if plan.status == WAITING else PLAN_WAITS)


def pass_on_calls(context: AgentContext, tickets: Tickets) -> None:
    for ticket in watched(tickets):
        for kind, key, values, every in calls(tickets, ticket):
            if kind in NUDGED or not (context.every(kind, f"{ticket.ref}|{key}", Trigger(every=every, unit=MINUTES)) if every else context.once(kind, f"{ticket.ref}|{key}")):
                continue
            if kind == PLAN_DONE_CALL:
                tickets.raise_moment(ticket.n, FINISHED)
            else:
                context.agent.whisper(kind, ticket=ticket.n, title=ticket.title, **values)


def look_at_stuck(context: AgentContext, tickets: Tickets) -> None:
    for ticket, state in tickets._needing_a_look(tickets._orchestrating()):
        if state.kind == "stopped" and tickets._revive(ticket):
            context.agent.whisper("ticket_restarted", ticket=ticket.n, title=ticket.title)
        elif context.every(ATTENTION_EVERY, f"{ticket.ref}|{state.kind}", Trigger(every=LOOK_AGAIN, unit=MINUTES)):
            tickets.raise_moment(ticket.n, STUCK, reason=state.text)


class HoldTicketKnowledge(Handler):
    def handle(self, context: Context, event: ResourceCreated) -> None:
        if event.type in HELD:
            Tickets(context.record, actor=SYSTEM).hold(event.type, event.n)


class WakeTheTicketAgent(Handler):
    def handle(self, context: Context, event: QuestionAnswered) -> None:
        tickets = Tickets(context.record, actor=SYSTEM)
        n = tickets._owned_by(context.record.env, "ticket")
        if not n:
            return
        question = Questions(context.record, actor=SYSTEM).load(event.n)
        try:
            tickets.tell(n, f"Your question {question.n}, {question.title}, is answered: {question.outcome}")
        except Refused:
            return


@dataclass(frozen=True)
class TicketClosed(ResourceEvent):
    on: ClassVar[str] = "ticket.completed"


class FinishTheBoardWithItsLastTicket(Handler):
    def handle(self, context: Context, event: TicketClosed) -> None:
        tickets = Tickets(context.record, actor=SYSTEM)
        board = tickets._board(tickets.load(event.n))
        if not board or not board.started or board.finished:
            return
        if any(int(other.board) == board.n for other in tickets.rows.standing()):
            return
        Boards(context.record, actor=SYSTEM).finish(board.n)


def watched(tickets: Tickets) -> list:
    boards = tickets._orchestrating()
    if not boards:
        return []
    paused = Boards(tickets.record, actor=SYSTEM).paused()
    return [t for t in tickets.rows.standing() if t.work_environment and t.board and int(t.board) in boards and int(t.board) not in paused]


def ticket_calls(kind: str):
    def about(context, agent) -> list[Sent]:
        tickets = Tickets(context.record, actor=SYSTEM)
        return [Sent(f"{ticket.ref}|{key}", {"ticket": ticket.n, "title": ticket.title, **values})
                for ticket in watched(tickets) for called, key, values, _ in calls(tickets, ticket) if called == kind]
    return about


def decisions(permission: str):
    def about(context, agent) -> list[Sent]:
        return [Sent(ticket.ref, {"ticket": ticket.n, "title": ticket.title})
                for ticket, waiting in Tickets(context.record, actor=SYSTEM)._awaiting_decisions() if waiting == permission]
    return about


def boards_to_check(context, agent) -> list[Sent]:
    boards = Tickets(context.record, actor=SYSTEM)._orchestrating()
    if not boards or all_parked(context.record):
        return []
    if agent.idle_for < float(context.feature.cadence(context.record, "board check").every) * MINUTE:
        return []
    return [Sent(",".join(map(str, boards)), {"about": ", ".join(f"board {n}" for n in boards)})]
