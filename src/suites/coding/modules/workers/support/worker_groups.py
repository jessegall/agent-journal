from engine.database.kept_rows import KeptRows
from engine.query.queries import Queries
from core.modules.plans.support.plan_task_order import PlanTaskOrder
from engine.setting.setting_values import SettingValues
from core.modules.tasks.models.task import Task
from suites.coding.modules.workers.models.worker_test_run import WorkerTestRun
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.support.worker_phases import WorkerPhases
from suites.coding.modules.workers.support.worker_phases import BATCH_SIZE
from suites.coding.modules.workers.support.worker_settings import WORKER_PHASE_TEST_RUNS
from suites.coding.modules.workers.support.worker_test_group import WorkerTestGroup

RUN_WINDOW_KEY = "commit:{worktree}:{task}"

class WorkerGroups:
    """A worker's group of tasks: its key, the tasks of it not handed in, and the worker's own test runs left.
    The runs a worker starts itself are counted between two commits: the count starts anew once its worktree
    is on the next task."""

    def __init__(self, phases: WorkerPhases, queries: Queries, settings: SettingValues, plan_order: PlanTaskOrder, kept: KeptRows) -> None:
        self.phases, self.queries, self.settings, self.plan_order, self.kept = phases, queries, settings, plan_order, kept

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
        return min(BATCH_SIZE - len(group.tasks) + len(started), len(started) + unplanned)

    @staticmethod
    def run_window_key(worktree: Worktree) -> str:
        return RUN_WINDOW_KEY.format(worktree=worktree.id, task=worktree.task_id)

    def test_runs_available(self, worktree: Worktree) -> int:
        worker_id, window_key = worktree.session_agent_id, self.run_window_key(worktree)
        used = self.kept.read("worker_test_runs", self.queries.query(WorkerTestRun).filter(worker_id=worker_id, group_key=window_key).count,
                              "worker_id = ? AND group_key = ?", [worker_id, window_key], name="workers.test_run_count")
        return self.settings.number(WORKER_PHASE_TEST_RUNS) - used
