from features.base import Feature
from features.journal import Journal
from features.tickets.commands import ShowTicketTodos
from features.tickets.controller import Tickets
from features.tickets.details import TicketsDetails
from features.tickets.handlers import FinishTheBoardWithItsLastTicket, HoldTicketKnowledge, LookAfterTicketBranches, WakeTheTicketAgent
from features.tickets.limits import DraftsCarryOneLine, FillerKeepsToTheBoard, PanelRepliesStayShort
from features.boards.controller import CARD_ROWS
from features.plans.progress import PHASE_ROWS
from features.plans.resource import PHASE
from features.plans.worker import PHASE_STARTS
from features.tickets.phases import start_phase_tickets

__all__ = ["Tickets"]


class TicketsFeature(Feature):
    details = TicketsDetails

    def register(self, journal: Journal) -> None:
        PHASE_ROWS[PHASE.tickets] = Tickets
        CARD_ROWS[:] = [Tickets]
        if start_phase_tickets not in PHASE_STARTS:
            PHASE_STARTS.append(start_phase_tickets)
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
