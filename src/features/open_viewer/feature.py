from features.base import Feature
from features.journal import Journal
from features.open_viewer.details import OpenViewerDetails
from features.open_viewer.handlers import ShowViewerTab


class OpenViewer(Feature):
    details = OpenViewerDetails

    def register(self, journal: Journal) -> None:
        journal.events.handler(ShowViewerTab())
