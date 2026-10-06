from features.base import Feature
from features.message_buttons.details import MessageButtonsDetails
from features.message_buttons.handlers import DropUnknownButtons
from features.journal import Journal


class MessageButtons(Feature):
    details = MessageButtonsDetails

    def register(self, journal: Journal) -> None:
        journal.events.handler(DropUnknownButtons())
