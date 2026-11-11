from engine.command.context import Context
from engine.command.handler import Handler
from engine.listener.event_rows import EventRows
from engine.repository.repository import Repository
from engine.query.queries import Queries
from core.modules.plans.models.checkpoint_reach import CheckpointReach
from core.modules.plans.support.plan_checkpoints import PlanCheckpoints
from suites.coding.modules.workers.commands.start_worker_runs.start_worker_runs import StartWorkerRuns
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.models.worktree_reach import WorktreeReach
from suites.coding.modules.workers.support.worker_run_windows import WorkerRunWindows


class StartWorkerRunsHandler(Handler[StartWorkerRuns, tuple[CheckpointReach, ...]]):
    """Starts a worker run for each checkpoint whose open tasks are all the worker's and now all committed, on
    the commit just made, in the background. A checkpoint whose run still goes is left until that run ends,
    and a checkpoint already run on this commit is not run again."""

    command = StartWorkerRuns

    def __init__(self, rows: EventRows, queries: Queries, repository: Repository, windows: WorkerRunWindows, checkpoints: PlanCheckpoints) -> None:
        self.rows, self.queries, self.repository = rows, queries, repository
        self.windows, self.checkpoints = windows, checkpoints

    def handle(self, command: StartWorkerRuns, context: Context) -> tuple[CheckpointReach, ...]:
        worktree = self.rows.required(Worktree, command.worktree_id)
        run_phase_ids = {row.phase_id for row in self.queries.query(WorktreeReach).filter(worktree_id=worktree.id, commit_id=command.commit_id).all_rows()}
        reaches = list[CheckpointReach]()
        for window in self.windows.completed_by(worktree):
            if window.checkpoint_id in run_phase_ids:
                continue
            reach = self.checkpoints.reach_worker(window.plan_id, window.checkpoint_id, window.task_ids, context)
            if reach is None:
                continue
            self.repository.save(WorktreeReach(reach_id=reach.id, worktree_id=worktree.id, phase_id=window.checkpoint_id, commit_id=command.commit_id), context)
            reaches.append(reach)
        return tuple(reaches)
