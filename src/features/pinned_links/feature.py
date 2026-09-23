from features.base import Feature
from features.journal import Journal
from features.pinned_links.details import PinnedLinksDetails
from features.pinned_links.handlers import RemindToPinLinks


class PinnedLinks(Feature):
    details = PinnedLinksDetails

    def register(self, journal: Journal) -> None:
        journal.events.handler(RemindToPinLinks())
