from engine.services import SOURCES
from features.base import Feature
from features.hosting.apps import CardExtra, app_on_card, ticket_apps
from features.hosting.commands import HostApp, ShowApp, StopApp
from features.hosting.details import HostingDetails
from features.hosting.handlers import StopIdleApps
from features.journal import Journal
from features.tickets.controller import CARD_EXTRAS


class HostingFeature(Feature):
    details = HostingDetails

    def register(self, journal: Journal) -> None:
        journal.commands.add("ticket", HostApp())
        journal.commands.add("ticket", StopApp())
        journal.commands.add("ticket", ShowApp())
        journal.events.handler(StopIdleApps())
        self.register_global(SOURCES, ticket_apps, list)
        self.register_global(CARD_EXTRAS, app_on_card, lambda: CardExtra([]))
