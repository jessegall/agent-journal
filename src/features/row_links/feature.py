from features.base import Feature
from features.journal import Journal
from features.row_links.details import RowLinksDetails
from features.row_links.formatters import MarkPaths, MarkRows, UnwrapChips
from features.row_links.handlers import NameAmbiguousFiles


class RowLinks(Feature):
    details = RowLinksDetails

    def register(self, journal: Journal) -> None:
        journal.client.formatter(MarkRows())
        journal.client.formatter(MarkPaths())
        journal.client.formatter(UnwrapChips())
        journal.events.handler(NameAmbiguousFiles())
