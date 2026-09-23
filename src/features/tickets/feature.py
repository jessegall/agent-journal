from features.base import Feature
from features.journal import Journal
from features.tickets.controller import Tickets
from features.tickets.details import TicketsDetails
from features.tickets.handlers import HoldTicketKnowledge, LookAfterTicketBranches

__all__ = ["Tickets"]


class TicketsFeature(Feature):
    details = TicketsDetails

    def register(self, journal: Journal) -> None:
        journal.events.handler(LookAfterTicketBranches())
        journal.events.handler(HoldTicketKnowledge())
