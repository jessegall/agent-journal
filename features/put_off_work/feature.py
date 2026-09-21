from features.base import Feature
from features.put_off_work.details import DeferralDetails
from features.put_off_work.handlers import NameDeferredWork
from features.journal import Journal


class Deferral(Feature):
    details = DeferralDetails

    def register(self, journal: Journal) -> None:
        journal.events.handler(NameDeferredWork())
