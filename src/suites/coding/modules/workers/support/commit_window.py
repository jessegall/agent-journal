from engine.database.kept_rows import KeptRows
from engine.query.queries import Queries
from engine.setting.setting_values import SettingValues
from suites.coding.modules.workers.models.worker_test_run import WorkerTestRun
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.support.worker_settings import WORKER_PHASE_TEST_RUNS

WINDOW_KEY = "commit:{worktree}:{task}:{commit}"


class CommitWindow:
    """The stretch of a worker's work between two commits: its key, and the test runs the worker may still start
    itself in it. A new window begins with each commit, so the runs, and what the merger counts for a worker,
    start anew there."""

    def __init__(self, queries: Queries, settings: SettingValues, kept: KeptRows) -> None:
        self.queries, self.settings, self.kept = queries, settings, kept

    @staticmethod
    def key(worktree: Worktree) -> str:
        return WINDOW_KEY.format(worktree=worktree.id, task=worktree.task_id, commit=worktree.commit_count)

    def test_runs_available(self, worktree: Worktree) -> int:
        worker_id, window_key = worktree.session_agent_id, self.key(worktree)
        runs = self.queries.query(WorkerTestRun).filter(worker_id=worker_id, group_key=window_key)
        used = self.kept.read(runs, runs.count, name="workers.test_run_count")
        return self.settings.number(WORKER_PHASE_TEST_RUNS) - used
