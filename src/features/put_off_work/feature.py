from features.base import Feature
from features.put_off_work.details import PutOffWorkDetails
from features.put_off_work.handlers import NameDeferredWork
from features.journal import Journal


class PutOffWork(Feature):
    details = PutOffWorkDetails

    def register(self, journal: Journal) -> None:
        journal.events.handler(NameDeferredWork())
