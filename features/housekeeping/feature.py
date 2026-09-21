from features.base import Feature
from features.housekeeping.details import HousekeepingDetails
from features.housekeeping.handlers import TidyRuntime
from features.journal import Journal


class Housekeeping(Feature):
    details = HousekeepingDetails

    def register(self, journal: Journal) -> None:
        journal.events.handler(TidyRuntime())
