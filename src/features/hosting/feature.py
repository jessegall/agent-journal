from engine.services import SOURCES
from features.base import Feature
from features.hosting.card import app_on_card
from features.hosting.commands import HostApp, ShowApp, StopApp
from features.hosting.details import HostingDetails
from features.hosting.handlers import StopIdleApps
from features.hosting.services import ticket_apps
from features.journal import Journal
from features.tickets.cards import CARD_EXTRAS


class HostingFeature(Feature):
    details = HostingDetails

    def register(self, journal: Journal) -> None:
        journal.commands.add("ticket", HostApp())
        journal.commands.add("ticket", StopApp())
        journal.commands.add("ticket", ShowApp())
        journal.events.handler(StopIdleApps())
        SOURCES.add(self, ticket_apps)
        CARD_EXTRAS.add(self, app_on_card)
