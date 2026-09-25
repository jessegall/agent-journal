from features.base import Feature
from features.journal import Journal
from features.tickets.controller import Tickets
from features.tickets.details import TicketsDetails
from features.tickets.handlers import FinishTheBoardWithItsLastTicket, HoldTicketKnowledge, LookAfterTicketBranches, WakeTheTicketAgent
from features.tickets.limits import DraftsCarryOneLine, PanelRepliesStayShort

__all__ = ["Tickets"]


class TicketsFeature(Feature):
    details = TicketsDetails

    def register(self, journal: Journal) -> None:
        journal.events.handler(LookAfterTicketBranches())
        journal.events.handler(WakeTheTicketAgent())
        journal.events.handler(FinishTheBoardWithItsLastTicket())
        journal.events.handler(HoldTicketKnowledge())
        journal.commands.intercept("create", DraftsCarryOneLine())
        journal.commands.intercept("update", DraftsCarryOneLine())
        journal.commands.intercept("create", PanelRepliesStayShort())
