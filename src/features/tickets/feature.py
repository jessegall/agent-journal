from features.base import Feature
from features.journal import Journal
from features.tickets.commands import ShowTicketTodos
from features.tickets.controller import Tickets
from features.tickets.details import TicketsDetails
from features.nudges import Nudge
from features.tickets.controller import DRAFTS, WAITS
from features.tickets.handlers import (
    FinishTheBoardWithItsLastTicket,
    HoldTicketKnowledge,
    LookAfterTicketBranches,
    WakeTheTicketAgent,
    boards_to_check,
    decisions,
    ticket_calls,
)
from features.tickets.limits import DraftsCarryOneLine, FillerKeepsToTheBoard, PanelRepliesStayShort
from features.boards.controller import CARD_ROWS
from features.plans.controller import PHASE_ROWS, PHASE_STARTS, PLAN_STARTS
from features.plans.resource import PHASE
from features.tickets.phases import start_phase_tickets
from features.tickets.worker import start_worker

__all__ = ["Tickets"]


class TicketsFeature(Feature):
    details = TicketsDetails
    nudges = (
        Nudge("ticket_asks", behaviour="asks", about=ticket_calls("ticket_asks")),
        Nudge("ticket_awaits", behaviour="awaits", about=ticket_calls("ticket_awaits")),
        Nudge(WAITS, behaviour="decisions", about=decisions(WAITS)),
        Nudge(DRAFTS, behaviour="decisions", about=decisions(DRAFTS)),
        Nudge("check_board", behaviour="board check", about=boards_to_check),
    )

    def register(self, journal: Journal) -> None:
        self.register_always(PHASE_ROWS, Tickets, PHASE.tickets)
        self.register_always(CARD_ROWS, Tickets)
        self.register_global(PHASE_STARTS, start_phase_tickets, list)
        self.register_global(PLAN_STARTS, start_worker, str)
        journal.commands.add("ticket", ShowTicketTodos())
        journal.events.handler(LookAfterTicketBranches())
        journal.events.handler(WakeTheTicketAgent())
        journal.events.handler(FinishTheBoardWithItsLastTicket())
        journal.events.handler(HoldTicketKnowledge())
        journal.commands.intercept("create", DraftsCarryOneLine())
        journal.commands.intercept("update", DraftsCarryOneLine())
        journal.commands.intercept("create", PanelRepliesStayShort())
        journal.commands.intercept("create", FillerKeepsToTheBoard())
        journal.commands.intercept("update", FillerKeepsToTheBoard())
        journal.commands.intercept("complete", FillerKeepsToTheBoard())
