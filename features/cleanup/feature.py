from features.base import Feature
from features.cleanup.details import CleanupDetails
from features.cleanup.handlers import SayEvidence
from features.journal import Journal


class Cleanup(Feature):
    details = CleanupDetails

    def register(self, journal: Journal) -> None:
        journal.events.handler(SayEvidence())
