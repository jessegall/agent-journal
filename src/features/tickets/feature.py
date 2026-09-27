from features.base import Feature
from features.journal import Journal
from features.tickets.commands import ShowTicketTodos
from features.tickets.controller import Tickets
from features.tickets.details import TicketsDetails
from features.tickets.handlers import FinishTheBoardWithItsLastTicket, HoldTicketKnowledge, LookAfterTicketBranches, WakeTheTicketAgent
from features.tickets.limits import DraftsCarryOneLine, PanelRepliesStayShort

__all__ = ["Tickets"]


class TicketsFeature(Feature):
    details = TicketsDetails

    def register(self, journal: Journal) -> None:
        journal.commands.add("ticket", ShowTicketTodos())
        journal.events.handler(LookAfterTicketBranches())
        journal.events.handler(WakeTheTicketAgent())
        journal.events.handler(FinishTheBoardWithItsLastTicket())
        journal.events.handler(HoldTicketKnowledge())
        journal.commands.intercept("create", DraftsCarryOneLine())
        journal.commands.intercept("update", DraftsCarryOneLine())
        journal.commands.intercept("create", PanelRepliesStayShort())
