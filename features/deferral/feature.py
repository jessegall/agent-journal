from features.base import Feature
from features.deferral.details import DeferralDetails
from features.deferral.handlers import NameDeferredWork
from features.journal import Journal


class Deferral(Feature):
    details = DeferralDetails

    def register(self, journal: Journal) -> None:
        journal.events.handler(NameDeferredWork())
