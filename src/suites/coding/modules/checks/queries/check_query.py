from core.base.query.conditions.greater import Greater
from core.base.database.database import Database
from core.base.model.tables import Tables
from core.base.query.conditions.is_null import IsNull
from core.base.query.conditions.less import Less
from core.base.query.query import Query
from engine.time.timestamp import Timestamp
from datetime import timedelta
from suites.coding.modules.checks.models.check import Check
from suites.coding.modules.checks.conditions.interval_passed import IntervalPassed
from suites.coding.modules.checks.queries.conditions.task_wait_command_failure import TaskWaitCommandFailure


CHECKS_REASON = "The checks of a project are a catalogue a person or an agent makes one at a time, and a round runs every one of them."


class CheckQuery(Query[Check]):
    """Reads checks: the ones not removed, those that run, those due to run and the failing ones
    the agent is due to be told about, which the database picks and the rule unreported_rows
    loads the rest of."""

    def __init__(self, database: Database, tables: Tables) -> None:
        super().__init__(database, tables, Check)

    def kept(self) -> list[Check]:
        return list(self.oldest().full_table(CHECKS_REASON).all_rows())

    def running(self) -> list[Check]:
        return [check for check in self.kept() if check.is_running]

    def broken_task_waits(self) -> list[Check]:
        return list(self.matching(Greater("task_wait_id", 0)).filter(last_passed=False).matching(TaskWaitCommandFailure()).oldest().all_rows())

    def due(self, present: Timestamp) -> list[Check]:
        return list(self.filter(stopped=False).matching(IntervalPassed(present.text)).oldest().all_rows())

    def unreported(self, present: Timestamp, repeat_minutes: int) -> list[Check]:
        failing = self.matching(IsNull("task_wait_id")).filter(stopped=False, last_passed=False)
        unreported_rows = failing.matching(IsNull("reported_at")).oldest().all_rows()
        cutoff = Timestamp(present.value - timedelta(minutes=repeat_minutes))
        repeat_rows = failing.matching(Less("reported_at", cutoff.text)).oldest().all_rows()
        return sorted([*unreported_rows, *repeat_rows], key=lambda check: check.id)
