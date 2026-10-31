from core.base.database.database import Database
from core.base.model.tables import Tables
from core.base.query.conditions.is_null import IsNull
from core.base.query.query import Query
from core.base.timestamp import Timestamp
from core.modules.triggers.models.trigger import Trigger


class TriggerQuery(Query[Trigger]):
    """Reads triggers, the ones still open, those met by a phrase and those whose time has come."""

    def __init__(self, database: Database, tables: Tables) -> None:
        super().__init__(database, tables, Trigger)

    def open(self) -> list[Trigger]:
        return list(self.matching(IsNull("ended_at")).oldest().all_rows())

    def phrased(self) -> list[Trigger]:
        return [trigger for trigger in self.open() if not trigger.is_scheduled]

    def due(self, present: Timestamp) -> list[Trigger]:
        return [trigger for trigger in self.open() if trigger.next_at is not None and trigger.next_at <= present]
