from features.base import Feature
from features.journal import Journal
from features.row_links.details import RowLinksDetails
from features.row_links.formatters import MarkRows


class RowLinks(Feature):
    details = RowLinksDetails

    def register(self, journal: Journal) -> None:
        journal.client.formatter(MarkRows())
