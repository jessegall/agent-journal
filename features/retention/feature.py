from features.base import Feature
from features.journal import Journal
from features.retention.details import RetentionDetails
from features.retention.handlers import ExpireOldRows


class Retention(Feature):
    details = RetentionDetails

    def register(self, journal: Journal) -> None:
        journal.events.handler(ExpireOldRows())
