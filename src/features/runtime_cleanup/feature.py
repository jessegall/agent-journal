from engine.events.resources import ResourceCreated
from expects import Given, Unchanged
from features.base import Feature
from features.runtime_cleanup.details import RuntimeCleanupDetails
from features.runtime_cleanup.handlers import TidyAfterUpdate, TidyRuntime
from features.journal import Journal
from resources.base import SYSTEM
from resources.types import Notification


class RuntimeCleanup(Feature):
    details = RuntimeCleanupDetails

    def register(self, journal: Journal) -> None:
        journal.events.handler(TidyRuntime())
        journal.events.handler(TidyAfterUpdate(), expects=[
            Given(ResourceCreated(n=1, type="notification", action="created", actor=SYSTEM), rows=[Notification(n=1, title="Something finished", data={"kind": "other"})]) >> Unchanged(),
        ])
