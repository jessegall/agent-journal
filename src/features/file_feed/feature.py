from features.base import Feature
from features.file_feed.details import FileFeedDetails
from features.file_feed.handlers import KeepEdits
from features.journal import Journal


class FileFeed(Feature):
    details = FileFeedDetails

    def register(self, journal: Journal) -> None:
        journal.events.handler(KeepEdits())
