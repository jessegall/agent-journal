from features.base import Feature
from features.runtime_cleanup.details import HousekeepingDetails
from features.runtime_cleanup.handlers import TidyAfterUpdate, TidyRuntime
from features.journal import Journal


class Housekeeping(Feature):
    details = HousekeepingDetails

    def register(self, journal: Journal) -> None:
        journal.events.handler(TidyRuntime())
        journal.events.handler(TidyAfterUpdate())
