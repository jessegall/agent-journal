from features.base import Feature
from features.source_links.details import SourceLinksDetails
from features.source_links.handlers import NameUncitedSource
from features.journal import Journal


class SourceLinks(Feature):
    details = SourceLinksDetails

    def register(self, journal: Journal) -> None:
        journal.events.handler(NameUncitedSource())
