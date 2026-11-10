from engine.query.queries import Queries
from core.modules.plans.support.plan_task_order import PlanTaskOrder
from core.modules.settings.bindings.support.setting_values import SettingValues
from core.modules.tasks.models.task import Task
from suites.coding.modules.workers.models.worker_test_run import WorkerTestRun
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.support.worker_phases import WorkerPhases
from suites.coding.modules.workers.support.worker_settings import TEST_BATCH_SIZE, WORKER_PHASE_TEST_RUNS
from suites.coding.modules.workers.support.worker_test_group import WorkerTestGroup


class WorkerGroups:
    """A worker's group of tasks: its key, the tasks of it not handed in, and the worker's own test runs left."""

    def __init__(self, phases: WorkerPhases, queries: Queries, settings: SettingValues, plan_order: PlanTaskOrder) -> None:
        self.phases, self.queries, self.settings, self.plan_order = phases, queries, settings, plan_order

    @staticmethod
    def group_key(group: WorkerTestGroup | None) -> str | None:
        return None if group is None or (group.phase is None and not group.tasks) else group.key

    def open_task_count(self, group: WorkerTestGroup | None, started: tuple[Task, ...], ready: tuple[Task, ...]) -> int:
        if group is None:
            return len(started)
        self.phases.plans.prepare([task.id for task in (*started, *ready)])
        if group.phase is not None:
            return sum(self.phases.phase(task) == group.phase for task in (*started, *ready))
        planned = {row.task_id for row in self.plan_order.task_rows(ready)} if ready else set[int]()
        unplanned = sum(task.id not in planned for task in ready)
        return min(self.settings.number(TEST_BATCH_SIZE) - len(group.tasks) + len(started), len(started) + unplanned)

    def test_runs_available(self, worktree: Worktree, group: WorkerTestGroup | None) -> int | None:
        key = self.group_key(group)
        if key is None:
            return None
        used = self.queries.query(WorkerTestRun).filter(worker_id=worktree.session_agent_id, group_key=key).count()
        return self.settings.number(WORKER_PHASE_TEST_RUNS) - used
