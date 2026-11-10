import re
from collections.abc import Mapping, Sequence

from core.base.command.context import Context
from engine.query.conditions.among import Among
from engine.query.queries import Queries
from engine.enums.log_level import LogLevel
from engine.repository.repository import Repository
from engine.log.system_log_writer import SystemLogWriter
from core.modules.settings.bindings.support.setting_values import SettingValues
from suites.coding.modules.workers.models.enums.test_failure_source import TestFailureSource
from suites.coding.modules.workers.models.worker_test_failure import WorkerTestFailure
from suites.coding.modules.workers.support.merger_inbox import MergerInbox
from suites.coding.modules.workers.support.merger_nudges import MERGER_SOURCE
from suites.coding.modules.workers.support.worker_settings import DELIVERY_FAILURE_LIMIT, WORKER_RUN_FAILURE_LIMIT

TEST_FILE_PATTERN = re.compile(r"[\w./-]*(?:test|stories)[\w./-]*\.(?:py|js|mjs|go)|[\w./-]+_test\.go")
ALL_RUN_TESTS = "the whole run"
DELIVERY_REVIEW_INTERVAL_COUNT = 3


class WorkerTestFailures:
    """Records each failed hand-in and each failed test a worker ran, in the system log and in a row kept from
    the worker. A task past the limit of a setting has lines for the main agent to read before it merges, and
    every third failed hand-in of a task puts a line before the merger, since only a pass ends a task's run of
    them."""

    def __init__(self, queries: Queries, repository: Repository, settings: SettingValues, system_log: SystemLogWriter, inbox: MergerInbox) -> None:
        self.queries, self.repository, self.settings, self.system_log, self.inbox = queries, repository, settings, system_log, inbox

    def record_delivery(self, worker_id: int, task_id: int, test_name: str, context: Context) -> None:
        self.record(worker_id, task_id, TestFailureSource.DELIVERY, test_name, context)
        failures = self.queries.query(WorkerTestFailure).filter(task_id=task_id, source=TestFailureSource.DELIVERY).count()
        if failures % DELIVERY_REVIEW_INTERVAL_COUNT == 0:
            self.inbox.send(f"worker:{worker_id} failed {failures} hand-ins in a row on task:{task_id}: work out where it goes wrong and tell it", MERGER_SOURCE, context)

    def record_worker_run(self, worker_id: int, task_id: int, line: str, context: Context) -> None:
        for test_name in self.test_names(line):
            self.record(worker_id, task_id, TestFailureSource.WORKER_RUN, test_name, context)

    def record(self, worker_id: int, task_id: int, source: TestFailureSource, test_name: str, context: Context) -> None:
        self.system_log.write(LogLevel.WARNING, f"worker {worker_id}, task {task_id}: {source} failed: {test_name}")
        self.repository.save(WorkerTestFailure(worker_id=worker_id, task_id=task_id, source=source, test_name=test_name), context)

    def flagged_lines(self, task_ids: Sequence[int]) -> Mapping[int, tuple[str, ...]]:
        failures = tuple(self.queries.query(WorkerTestFailure).matching(Among("task_id", task_ids)).all_rows())
        return {task_id: self.task_lines([row for row in failures if row.task_id == task_id]) for task_id in task_ids}

    def task_lines(self, failures: Sequence[WorkerTestFailure]) -> tuple[str, ...]:
        delivery_tests = [row.test_name for row in failures if row.source is TestFailureSource.DELIVERY]
        worker_run_tests = [row.test_name for row in failures if row.source is TestFailureSource.WORKER_RUN]
        repeated_tests = sorted({name for name in worker_run_tests if worker_run_tests.count(name) >= self.settings.number(WORKER_RUN_FAILURE_LIMIT)})
        lines = [f"its own runs failed {worker_run_tests.count(name)} times: {name}" for name in repeated_tests]
        if len(delivery_tests) >= self.settings.number(DELIVERY_FAILURE_LIMIT):
            lines.insert(0, f"failed {len(delivery_tests)} hand-ins: {', '.join(sorted(set(delivery_tests)))}")
        return tuple(lines)

    @staticmethod
    def test_names(line: str) -> list[str]:
        return list(dict.fromkeys(TEST_FILE_PATTERN.findall(line))) or [ALL_RUN_TESTS]
