from features.base import Feature
from features.journal import Journal
from features.tabfocus.details import TabFocusDetails
from features.tabfocus.handlers import ShowViewerTab


class TabFocus(Feature):
    details = TabFocusDetails

    def register(self, journal: Journal) -> None:
        journal.events.handler(ShowViewerTab())
