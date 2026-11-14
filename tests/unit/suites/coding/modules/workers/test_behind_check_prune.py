from datetime import datetime, timedelta, timezone
from types import SimpleNamespace

from engine.time.timestamp import Timestamp
from suites.coding.modules.workers.commands.prune_behind_checks.prune_behind_checks import PruneBehindChecks
from suites.coding.modules.workers.commands.prune_behind_checks.prune_behind_checks_handler import PruneBehindChecksHandler
from suites.coding.modules.workers.models.enums.behind_check_state import BehindCheckState as State
from suites.coding.modules.workers.models.worktree_behind_check import WorktreeBehindCheck
from suites.coding.modules.workers.support.worker_settings import CHECK_HISTORY_DAYS, WORKER_SETTING_VALUES

NOW = datetime(2026, 11, 12, 9, 0, tzinfo=timezone.utc)


def check(number: int, state: State, days_old: int) -> WorktreeBehindCheck:
    return WorktreeBehindCheck(id=number, environment_id=1, worktree_id=1, base_tip="abc", commits_lagging=3, state=state, updated_at=Timestamp(NOW - timedelta(days=days_old)))


class Store:
    """Checks filtered by state and by their last change, as the query of the prune reads them."""

    def __init__(self, *rows: WorktreeBehindCheck) -> None:
        self.rows, self.deleted = list(rows), []

    def query(self, model: type) -> "Store":
        return Store(*self.rows)

    def matching(self, condition) -> "Store":
        if getattr(condition, "values", None) is not None:
            return Store(*[row for row in self.rows if row.state in condition.values])
        return Store(*[row for row in self.rows if row.updated_at.text <= condition.value])

    def ordered(self, *columns: str) -> "Store":
        return self

    def take(self, size: int) -> list[WorktreeBehindCheck]:
        return self.rows[:size]

    def delete_many_stored(self, rows, context) -> None:
        self.deleted += [row.id for row in rows]


class Settings:
    def number(self, key: str) -> int:
        return {CHECK_HISTORY_DAYS: 30}[key]


def test_the_prune_removes_old_closed_checks_and_never_an_open_one():
    rows = [check(1, State.UPDATED, 40), check(2, State.IGNORED, 31), check(3, State.REMOVED, 10), check(4, State.OPEN, 90), check(5, State.ORDERED, 90),
            check(6, State.CONFLICTED, 90), check(7, State.PASSED, 90)]
    queries, repository = Store(*rows), Store()
    removed = PruneBehindChecksHandler(queries, repository, Settings()).handle(PruneBehindChecks(), SimpleNamespace(timestamp=Timestamp(NOW)))
    assert (removed, repository.deleted) == (2, [1, 2])


def test_the_history_setting_is_set_by_a_person():
    declared = next(value for value in WORKER_SETTING_VALUES if CHECK_HISTORY_DAYS.endswith(f".{value.key}"))
    assert declared.person_set
