from features.base import Feature
from features.file_feed.details import FileFeedDetails
from features.file_feed.handlers import KeepEdits
from features.journal import Journal
from features.file_feed.routes import get_changes, get_edited_file, get_edits, get_older_edits


class FileFeed(Feature):
    details = FileFeedDetails

    def register(self, journal: Journal) -> None:
        journal.routes.add(get_changes, get_edits, get_older_edits, get_edited_file)
        journal.events.handler(KeepEdits())
