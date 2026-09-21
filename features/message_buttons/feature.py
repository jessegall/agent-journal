from features.base import Feature
from features.message_buttons.details import ButtonsDetails
from features.message_buttons.handlers import DropUnknownButtons
from features.journal import Journal


class Buttons(Feature):
    details = ButtonsDetails

    def register(self, journal: Journal) -> None:
        journal.events.handler(DropUnknownButtons())
