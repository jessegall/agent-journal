from features.base import Feature
from features.journal import Journal
from features.auto_archive.details import AutoArchiveDetails
from features.auto_archive.handlers import ExpireOldRows


class AutoArchive(Feature):
    details = AutoArchiveDetails

    def register(self, journal: Journal) -> None:
        journal.events.handler(ExpireOldRows())
