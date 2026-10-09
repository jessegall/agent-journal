from features.base import Feature
from features.journal import Journal
from features.open_viewer.commands import (Appoint, Control, Force, Pause, Relaunch, Resume, RunShell, SaveSettings, SendKeys, ShowAttachments, ShowAttachmentsPage, ShowEvents, ShowHooks, ShowLinks,
                                          ShowManifest, ShowOnline, ShowOptions, ShowScreen, ShowSettings, ShowSummary, ShowTranscript, WireHooks)
from features.open_viewer.details import OpenViewerDetails
from features.open_viewer.handlers import ShowViewerTab


class OpenViewer(Feature):
    details = OpenViewerDetails

    def register(self, journal: Journal) -> None:
        journal.events.handler(ShowViewerTab())
        for command in (ShowManifest(), ShowSummary(), ShowEvents(), ShowAttachments(), ShowAttachmentsPage()):
            journal.commands.add("environment", command)
        journal.commands.add("feature", ShowSettings())
        journal.commands.add("feature", SaveSettings())
        for command in (ShowOnline(), Appoint(), ShowOptions(), RunShell(), ShowScreen(), SendKeys(), Relaunch(), Force(), Pause(), Resume(), Control(), ShowHooks(),
                        WireHooks(), ShowTranscript(), ShowLinks()):
            journal.commands.add("agent", command)
