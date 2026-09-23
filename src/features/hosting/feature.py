from engine.services import SOURCES
from features.base import Feature
from features.hosting.apps import ticket_apps
from features.hosting.commands import HostApp, ShowApp, StopApp
from features.hosting.details import HostingDetails
from features.hosting.handlers import StopIdleApps
from features.journal import Journal


class HostingFeature(Feature):
    details = HostingDetails

    def register(self, journal: Journal) -> None:
        journal.commands.add("ticket", HostApp())
        journal.commands.add("ticket", StopApp())
        journal.commands.add("ticket", ShowApp())
        journal.events.handler(StopIdleApps())
        if ticket_apps not in SOURCES:
            SOURCES.append(ticket_apps)
