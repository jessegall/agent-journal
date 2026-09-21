from features.base import Feature
from features.buttons.details import ButtonsDetails
from features.buttons.handlers import DropUnknownButtons
from features.journal import Journal


class Buttons(Feature):
    details = ButtonsDetails

    def register(self, journal: Journal) -> None:
        journal.events.handler(DropUnknownButtons())
