from features.acknowledgements.details import AcknowledgementsDetails
from features.acknowledgements.handlers import HideJournalOnlyTurns
from features.base import Feature
from features.journal import Journal


class Acknowledgements(Feature):
    details = AcknowledgementsDetails

    def register(self, journal: Journal) -> None:
        journal.events.handler(HideJournalOnlyTurns())
