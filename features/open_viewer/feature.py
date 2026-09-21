from features.base import Feature
from features.journal import Journal
from features.open_viewer.details import TabFocusDetails
from features.open_viewer.handlers import ShowViewerTab


class TabFocus(Feature):
    details = TabFocusDetails

    def register(self, journal: Journal) -> None:
        journal.events.handler(ShowViewerTab())
