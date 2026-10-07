from features.base import Feature
from features.helpers.controller import Helpers
from features.helpers.details import HelpersDetails
from features.helpers.handlers import NameStoppedOrQuietHelpers, TellAFailedTurnOnChange
from features.helpers.interceptors import HandedRowsCloseOnlyThroughTheirHelper, HandedRowsStayAssigned
from features.journal import Journal

__all__ = ["Helpers"]


class HelpersFeature(Feature):
    details = HelpersDetails

    def register(self, journal: Journal) -> None:
        journal.events.handler(TellAFailedTurnOnChange())
        journal.events.handler(NameStoppedOrQuietHelpers())
        journal.commands.intercept("todo.complete", HandedRowsCloseOnlyThroughTheirHelper())
        journal.commands.intercept("todo.update", HandedRowsStayAssigned())
