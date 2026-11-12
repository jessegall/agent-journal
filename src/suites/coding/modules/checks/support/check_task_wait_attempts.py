from collections.abc import Sequence

from engine.query.conditions.among import Among
from engine.query.conditions.is_null import IsNull
from engine.query.queries import Queries
from core.modules.tasks.support.task_wait_attempts import TaskWaitAttempts
from suites.coding.modules.checks.models.check import Check

WAIT_CHECKS_REASON = "the last run of the check of every task wait asked about is shown"


class CheckTaskWaitAttempts(TaskWaitAttempts):
    """Finds the last run of each task wait's check."""

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def last_runs(self, wait_ids: Sequence[int]) -> dict[int, str]:
        if not wait_ids:
            return {}
        checks = self.queries.query(Check).matching(Among("task_wait_id", wait_ids)).matching(IsNull("removed_at")).every_row(WAIT_CHECKS_REASON)
        return {check.task_wait_id: check.last_run_at.text for check in checks if check.task_wait_id is not None and check.last_run_at is not None}
