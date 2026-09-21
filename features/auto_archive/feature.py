from features.base import Feature
from features.journal import Journal
from features.auto_archive.details import RetentionDetails
from features.auto_archive.handlers import ExpireOldRows


class Retention(Feature):
    details = RetentionDetails

    def register(self, journal: Journal) -> None:
        journal.events.handler(ExpireOldRows())
