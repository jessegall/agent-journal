from features.base import Feature
from features.runtime_cleanup.details import RuntimeCleanupDetails
from features.runtime_cleanup.handlers import TidyAfterUpdate, TidyRuntime
from features.journal import Journal


class RuntimeCleanup(Feature):
    details = RuntimeCleanupDetails

    def register(self, journal: Journal) -> None:
        journal.events.handler(TidyRuntime())
        journal.events.handler(TidyAfterUpdate())
