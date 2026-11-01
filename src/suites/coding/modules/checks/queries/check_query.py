from core.base.database.database import Database
from core.base.model.tables import Tables
from core.base.query.conditions.is_null import IsNull
from core.base.query.conditions.less import Less
from core.base.query.query import Query
from core.base.timestamp import Timestamp
from datetime import timedelta
from suites.coding.modules.checks.models.check import Check
from suites.coding.modules.checks.queries.interval_passed import IntervalPassed



class CheckQuery(Query[Check]):
    """Reads checks: the ones not removed, those that run, those due to run and the failing ones the agent is due to be told
    about, which the database picks and the rule never loads the rest of."""

    def __init__(self, database: Database, tables: Tables) -> None:
        super().__init__(database, tables, Check)

    def kept(self) -> list[Check]:
        return list(self.matching(IsNull("removed_at")).oldest().all_rows())

    def running(self) -> list[Check]:
        return [check for check in self.kept() if check.is_running]

    def due(self, present: Timestamp) -> list[Check]:
        return list(self.matching(IsNull("removed_at")).filter(stopped=False).matching(IntervalPassed(present.text)).oldest().all_rows())

    def unreported(self, present: Timestamp, repeat_minutes: int) -> list[Check]:
        failing = self.matching(IsNull("removed_at")).filter(stopped=False, last_passed=False)
        never = failing.matching(IsNull("reported_at")).oldest().all_rows()
        cutoff = Timestamp(present.value - timedelta(minutes=repeat_minutes))
        again = failing.matching(Less("reported_at", cutoff.text)).oldest().all_rows()
        return sorted([*never, *again], key=lambda check: check.id)
