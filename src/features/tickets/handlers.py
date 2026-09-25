import time
from dataclasses import dataclass
from typing import ClassVar

from engine.actors import IDLE
from engine.events import ClockTicked, ResourceCreated, ResourceEvent
from features.parts import WHOLE_FEATURE, AgentContext, Context, Handler
from controllers.types import Works
from features.plans.controller import WAITING
from features.tickets.controller import HELD, Tickets
from features.tickets.details import TicketsDetails
from resources.base import CHECKPOINT, FINISHED, PLAN_WAITS, STUCK, SYSTEM, Refused

CHECK_AFTER = 300
LOOK_AGAIN = 900


def reminder(context) -> int:
    return int(time.time() // (max(1, int(TicketsDetails.values(context.record).remind_every)) * 60))


def all_parked(works: list) -> bool:
    return bool(works) and all(work.parked for work in works)


def called_again(context: AgentContext, name: str, every: int) -> bool:
    last = float(context.state.get(name) or 0)
    if time.time() - last < max(1, every) * 60:
        return False
    context.state.set(name, time.time())
    return True


class LookAfterTicketBranches(Handler):
    behaviour = WHOLE_FEATURE

    def handle(self, context: AgentContext, event: ClockTicked) -> None:
        tickets = Tickets(context.record, actor=SYSTEM)
        tickets.keep_branches()
        tickets.close_merged()
        tickets.start_queued()
        tickets._stop_orphaned()
        for ticket in tickets._awaiting_orchestrator():
            plan = tickets._plans(ticket).load(int(ticket.plan))
            if context.once("plan_waits", f"{ticket.ref}|{ticket.plan}|{plan.updated}"):
                context.record.emit("ticket", ticket.n, CHECKPOINT if plan.status == WAITING else PLAN_WAITS, SYSTEM)
        for ticket, permission in tickets._awaiting_decisions():
            if context.once("proposal_waits", f"{ticket.ref}|{permission}|{reminder(context)}"):
                context.agent.whisper(permission, ticket=ticket.n, title=ticket.title)
        boards = tickets._orchestrating()
        for ticket in [t for t in tickets._standing() if t.work_environment and t.board and int(t.board) in boards]:
            for kind, key, values, every in tickets._calls(ticket):
                if not (called_again(context, f"{kind}|{ticket.ref}|{key}", every) if every else context.once(kind, f"{ticket.ref}|{key}")):
                    continue
                if kind == "ticket_plan_done":
                    context.record.emit("ticket", ticket.n, FINISHED, SYSTEM)
                else:
                    context.agent.whisper(kind, ticket=ticket.n, title=ticket.title, **values)
        self.check_on_board(context, tickets)
        self.look_at_tickets(context, tickets)

    def look_at_tickets(self, context: AgentContext, tickets: Tickets) -> None:
        for ticket, state in tickets._needing_a_look(tickets._orchestrating()):
            if state.kind == "stopped" and tickets._revive(ticket):
                context.agent.whisper("ticket_restarted", ticket=ticket.n, title=ticket.title)
            elif context.once("ticket_attention", f"{ticket.ref}|{state.kind}|{int(time.time() // LOOK_AGAIN)}"):
                context.record.emit("ticket", ticket.n, STUCK, SYSTEM, reason=state.text)

    def check_on_board(self, context: AgentContext, tickets: Tickets) -> None:
        row = context.agent.row
        boards = tickets._orchestrating()
        if not boards or row.status != IDLE or all_parked(Works(context.record, actor=SYSTEM)._standing()):
            return
        quiet = time.time() - float(row.at)
        if quiet >= CHECK_AFTER and context.once("check_board", f"{boards}|{int(row.at)}|{int(quiet // CHECK_AFTER)}"):
            context.agent.whisper("check_board", about=", ".join(f"board {n}" for n in boards))


class HoldTicketKnowledge(Handler):
    def handle(self, context: Context, event: ResourceCreated) -> None:
        if event.type in HELD:
            Tickets(context.record, actor=SYSTEM).hold(event.type, event.n)


@dataclass(frozen=True)
class QuestionAnswered(ResourceEvent):
    on: ClassVar[str] = "question.completed"


class WakeTheTicketAgent(Handler):
    def handle(self, context: Context, event: QuestionAnswered) -> None:
        tickets = Tickets(context.record, actor=SYSTEM)
        n = tickets._owned_by(context.record.env, "ticket")
        if not n:
            return
        question = context.journal.of("question").load(event.n)
        try:
            tickets.tell(n, f"Your question {question.n}, {question.title}, is answered: {question.outcome}")
        except Refused:
            return
