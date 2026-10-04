from features.base import Feature
from features.record_audit.details import RecordAuditDetails
from features.record_audit.handlers import SayEvidence
from features.journal import Journal


class RecordAudit(Feature):
    details = RecordAuditDetails

    def register(self, journal: Journal) -> None:
        journal.events.handler(SayEvidence())
