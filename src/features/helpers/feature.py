from features.base import Feature
from features.helpers.controller import Helpers
from features.helpers.details import HelpersDetails
from features.helpers.handlers import TellAFailedTurnOnChange
from features.journal import Journal

__all__ = ["Helpers"]


class HelpersFeature(Feature):
    details = HelpersDetails

    def register(self, journal: Journal) -> None:
        journal.events.handler(TellAFailedTurnOnChange())
