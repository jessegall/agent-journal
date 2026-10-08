from features.base import Feature
from features.journal import Journal
from features.open_viewer.commands import SaveSettings, ShowAttachments, ShowEvents, ShowManifest, ShowOnline, ShowSettings, ShowSummary
from features.open_viewer.details import OpenViewerDetails
from features.open_viewer.handlers import ShowViewerTab


class OpenViewer(Feature):
    details = OpenViewerDetails

    def register(self, journal: Journal) -> None:
        journal.events.handler(ShowViewerTab())
        for command in (ShowManifest(), ShowSummary(), ShowEvents(), ShowAttachments()):
            journal.commands.add("environment", command)
        journal.commands.add("feature", ShowSettings())
        journal.commands.add("feature", SaveSettings())
        journal.commands.add("agent", ShowOnline())
