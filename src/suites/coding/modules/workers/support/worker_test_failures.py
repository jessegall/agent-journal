import logging
import re
from collections.abc import Mapping, Sequence

from core.base.command.context import Context
from core.base.query.conditions.among import Among
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.modules.settings.bindings.support.setting_values import SettingValues
from suites.coding.modules.workers.models.enums.test_failure_source import TestFailureSource
from suites.coding.modules.workers.models.worker_test_failure import WorkerTestFailure
from suites.coding.modules.workers.support.worker_settings import HAND_IN_FAILURES_TO_FLAG, OWN_TEST_FAILURES_TO_FLAG

LOGGER = logging.getLogger("journal.workers.test_failures")
TEST_FILE = re.compile(r"[\w./-]*(?:test|stories)[\w./-]*\.(?:py|js|mjs|go)|[\w./-]+_test\.go")
WHOLE_RUN = "the whole run"


class WorkerTestFailures:
    """Records each failed hand-in and each failed test a worker ran, in the system log and in a row kept from the
    worker. A task past the limit of a setting has lines for the main agent to read before it merges."""

    def __init__(self, queries: Queries, repository: Repository, settings: SettingValues) -> None:
        self.queries, self.repository, self.settings = queries, repository, settings

    def record_hand_in(self, worker_id: int, task_id: int, test_name: str, context: Context) -> None:
        self.record(worker_id, task_id, TestFailureSource.HAND_IN, test_name, context)

    def record_own_run(self, worker_id: int, task_id: int, line: str, context: Context) -> None:
        for test_name in self.test_names(line):
            self.record(worker_id, task_id, TestFailureSource.OWN_RUN, test_name, context)

    def record(self, worker_id: int, task_id: int, source: TestFailureSource, test_name: str, context: Context) -> None:
        LOGGER.warning("worker %s, task %s: %s failed: %s", worker_id, task_id, source, test_name)
        self.repository.save(WorkerTestFailure(worker_id=worker_id, task_id=task_id, source=source, test_name=test_name), context)

    def flagged_lines(self, task_ids: Sequence[int]) -> Mapping[int, tuple[str, ...]]:
        failures = tuple(self.queries.query(WorkerTestFailure).matching(Among("task_id", task_ids)).all_rows())
        return {task_id: self.task_lines([row for row in failures if row.task_id == task_id]) for task_id in task_ids}

    def task_lines(self, failures: Sequence[WorkerTestFailure]) -> tuple[str, ...]:
        hand_ins = [row.test_name for row in failures if row.source is TestFailureSource.HAND_IN]
        own_runs = [row.test_name for row in failures if row.source is TestFailureSource.OWN_RUN]
        repeated = sorted({name for name in own_runs if own_runs.count(name) >= self.settings.number(OWN_TEST_FAILURES_TO_FLAG)})
        hand_in_lines = [f"failed {len(hand_ins)} hand-ins: {', '.join(sorted(set(hand_ins)))}"] if len(hand_ins) >= self.settings.number(HAND_IN_FAILURES_TO_FLAG) else []
        return (*hand_in_lines, *(f"its own runs failed {own_runs.count(name)} times: {name}" for name in repeated))

    @staticmethod
    def test_names(line: str) -> tuple[str, ...]:
        return tuple(dict.fromkeys(TEST_FILE.findall(line))) or (WHOLE_RUN,)
