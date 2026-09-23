from features.base import Feature
from features.tickets.controller import Tickets
from features.tickets.details import TicketsDetails

__all__ = ["Tickets"]


class TicketsFeature(Feature):
    details = TicketsDetails
