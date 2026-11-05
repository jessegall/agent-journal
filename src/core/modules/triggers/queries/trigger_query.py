from core.base.database.database import Database
from core.base.model.tables import Tables
from core.base.query.conditions.is_null import IsNull
from core.base.query.query import Query
from core.base.timestamp import Timestamp
from core.modules.triggers.models.trigger import Trigger


class TriggerQuery(Query[Trigger]):
    """Reads triggers: the ones not ended, and of those not paused and not waiting for the user, the ones set
    off by words and the ones whose time has come."""

    def __init__(self, database: Database, tables: Tables) -> None:
        super().__init__(database, tables, Trigger)

    def open(self) -> list[Trigger]:
        return self.rows_without("ended_at")

    def active(self) -> list[Trigger]:
        return [trigger for trigger in self.open() if trigger.paused_at is None and not trigger.needs_enabling]

    def phrased(self) -> list[Trigger]:
        return [trigger for trigger in self.active() if not trigger.is_scheduled]

    def due(self, present: Timestamp) -> list[Trigger]:
        return [trigger for trigger in self.active() if trigger.next_at is not None and trigger.next_at <= present]
