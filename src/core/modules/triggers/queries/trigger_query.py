from core.base.database.database import Database
from core.base.database.kept_rows import KeptRows
from core.base.model.tables import Tables
from core.base.query.conditions.is_null import IsNull
from core.base.query.query import Query
from engine.time.timestamp import Timestamp
from core.modules.triggers.models.trigger import Trigger


class TriggerQuery(Query[Trigger]):
    """Reads triggers: the ones not ended, and of those not paused and not waiting for the user, the ones set
    off by words and the ones whose time has come."""

    def __init__(self, database: Database, tables: Tables, kept: KeptRows) -> None:
        super().__init__(database, tables, Trigger)
        self.kept = kept

    def open(self) -> list[Trigger]:
        return list(self.kept.read(self.table.name, lambda: tuple(self.matching(IsNull("ended_at")).oldest().all_rows()),
                                   "ended_at IS NULL", name="triggers.open_rows"))

    def active(self) -> list[Trigger]:
        return [trigger for trigger in self.open() if trigger.paused_at is None and not trigger.needs_enabling]

    def phrased(self) -> list[Trigger]:
        return [trigger for trigger in self.active() if not trigger.is_scheduled]

    def due(self, present: Timestamp) -> list[Trigger]:
        return [trigger for trigger in self.active() if trigger.next_at is not None and trigger.next_at <= present]
