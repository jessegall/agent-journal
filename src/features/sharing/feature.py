from engine.services import SOURCES
from features.base import Feature
from features.journal import Journal
from features.sharing.controller import Shares
from features.sharing.details import SharingDetails
from features.sharing.guard import HoldOnVisitorComment, NameVisitorComment, RefuseClaimedUser, RefuseUntilAgreed
from features.sharing.services import share_services
from features.sharing.routes import TICKS
from features.sharing.watchdog import TunnelWatch

__all__ = ["Shares"]


class SharingFeature(Feature):
    details = SharingDetails

    def register(self, journal: Journal) -> None:
        SOURCES.add(None, share_services)
        journal.events.handler(HoldOnVisitorComment())
        journal.events.handler(NameVisitorComment())
        TICKS.add(self, TunnelWatch(self))
        journal.agent.interceptor(RefuseUntilAgreed())
        journal.agent.interceptor(RefuseClaimedUser())
