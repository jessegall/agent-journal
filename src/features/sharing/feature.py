from engine.services import SOURCES
from features.base import Feature
from features.journal import Journal
from features.sharing.controller import Shares
from features.sharing.details import SharingDetails
from features.sharing.guard import HoldOnVisitorComment, NameVisitorComment, RefuseUntilAgreed
from features.sharing.services import share_services
from features.sharing.watchdog import KeepTunnelAnswering

__all__ = ["Shares"]


class SharingFeature(Feature):
    details = SharingDetails

    def register(self, journal: Journal) -> None:
        if share_services not in SOURCES:
            SOURCES.append(share_services)
        journal.events.handler(HoldOnVisitorComment())
        journal.events.handler(NameVisitorComment())
        journal.events.handler(KeepTunnelAnswering())
        journal.agent.interceptor(RefuseUntilAgreed())
