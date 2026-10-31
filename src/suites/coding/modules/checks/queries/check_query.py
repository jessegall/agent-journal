from core.base.database.database import Database
from core.base.model.tables import Tables
from core.base.query.conditions.is_null import IsNull
from core.base.query.query import Query
from core.base.timestamp import Timestamp
from datetime import timedelta
from suites.coding.modules.checks.models.check import Check



class CheckQuery(Query[Check]):
    """Reads checks: the ones not removed, those that run, those due to run and those failing."""

    def __init__(self, database: Database, tables: Tables) -> None:
        super().__init__(database, tables, Check)

    def kept(self) -> list[Check]:
        return list(self.matching(IsNull("removed_at")).oldest().all_rows())

    def running(self) -> list[Check]:
        return [check for check in self.kept() if check.is_running]

    def due(self, present: Timestamp) -> list[Check]:
        return [check for check in self.running() if check.interval_minutes and (check.last_run_at is None or Timestamp(check.last_run_at.value + timedelta(minutes=check.interval_minutes)) <= present)]

    def unreported(self, present: Timestamp, repeat_minutes: int) -> list[Check]:
        return [check for check in self.running() if check.last_passed is False and (check.reported_at is None or Timestamp(check.reported_at.value + timedelta(minutes=repeat_minutes)) <= present)]
