from features.base import Feature
from features.record_audit.details import CleanupDetails
from features.record_audit.handlers import SayEvidence
from features.journal import Journal


class Cleanup(Feature):
    details = CleanupDetails

    def register(self, journal: Journal) -> None:
        journal.events.handler(SayEvidence())
