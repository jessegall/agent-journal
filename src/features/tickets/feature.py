from engine.events.resources import QuestionAnswered
from expects import Given, Unchanged
from features.base import Feature
from features.boards.resource import Board
from features.tickets.handlers import TicketClosed
from features.tickets.resource import Ticket
from resources.base import USER
from resources.types import Question
from features.journal import Journal
from features.tickets.commands import ShowTicketTodos
from features.tickets.controller import Tickets
from features.tickets.details import TicketsDetails
from features.sending import Nudge
from features.tickets.orchestration import DRAFTS, WAITS
from features.tickets.handlers import (
    FinishTheBoardWithItsLastTicket,
    HoldTicketKnowledge,
    LookAfterTickets,
    WakeTheTicketAgent,
    boards_to_check,
    decisions,
    handed_in,
    ticket_calls,
)
from features.tickets.limits import DraftsCarryOneLine
from features.boards.controller import CARD_STORE
from features.plans.controller import PHASE_ROWS, PHASE_STARTS, PLAN_STARTS
from features.plans.resource import PHASE
from features.tickets.phases import start_tickets_of_phase
from features.tickets.worker import start_worker

__all__ = ["Tickets"]


CLOSED = TicketClosed(n=1, type="ticket", action="completed", actor=USER)


def card(n: int, **data) -> Ticket:
    return Ticket(n=n, title=f"Card {n}", data={"board": 1, **data})


class TicketsFeature(Feature):
    details = TicketsDetails
    nudges = (
        Nudge("ticket_asks", behaviour="asks", about=ticket_calls("ticket_asks"),
              guarantee="When a ticket's own agent asks a question, the agent orchestrating its board is told, and told again until it is answered."),
        Nudge("ticket_awaits", behaviour="awaits", about=ticket_calls("ticket_awaits"),
              guarantee="When a ticket's own agent is waiting on something, the agent orchestrating its board is told what it waits for."),
        Nudge(WAITS, behaviour="waits", about=decisions(WAITS),
              guarantee="When a ticket proposes that it should wait on another, the orchestrating agent is asked to accept or decline it."),
        Nudge(DRAFTS, behaviour="drafts", about=decisions(DRAFTS),
              guarantee="While a drafted ticket waits to be confirmed, the orchestrating agent is told it is waiting."),
        Nudge("ticket_handed_in", behaviour="handed in", about=handed_in,
              guarantee="While a ticket's finished work waits for the agent orchestrating its board, that agent is told how long it has waited and what to do: review, test and merge it."),
        Nudge("check_board", behaviour="board check", about=boards_to_check,
              guarantee="While a board has tickets running, the agent orchestrating it is told to look in on their agents."),
    )

    def register(self, journal: Journal) -> None:
        PHASE_ROWS.add(None, Tickets, key=PHASE.tickets)
        CARD_STORE.add(None, Tickets)
        PHASE_STARTS.add(self, start_tickets_of_phase)
        PLAN_STARTS.add(self, start_worker)
        journal.commands.add("ticket", ShowTicketTodos())
        journal.events.handler(LookAfterTickets())
        journal.events.handler(WakeTheTicketAgent(), expects=[
            Given(QuestionAnswered(n=1, type="question", action="answered", actor=USER), rows=[Question(n=1, title="Which branch?", completed=1.0)]) >> Unchanged(),
        ])
        journal.events.handler(FinishTheBoardWithItsLastTicket(), expects=[
            Given(CLOSED, rows=[card(1), Board(n=1, title="Launch")]) >> Unchanged(),
            Given(CLOSED, rows=[card(1), card(2), Board(n=1, title="Launch", data={"started": 5.0})]) >> Unchanged(),
            Given(CLOSED, rows=[card(1), Board(n=1, title="Launch", data={"started": 5.0, "finished": 9.0})]) >> Unchanged(),
        ])
        journal.events.handler(HoldTicketKnowledge())
        journal.commands.intercept("create", DraftsCarryOneLine())
        journal.commands.intercept("update", DraftsCarryOneLine())
