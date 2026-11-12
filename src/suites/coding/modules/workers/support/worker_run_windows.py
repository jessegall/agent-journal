from core.modules.plans.support.checkpoint_windows import CheckpointWindows
from core.modules.plans.models.phase import Phase
from core.modules.plans.support.plan_checkpoints import PlanCheckpoints
from core.modules.plans.support.task_plans import TaskPlans
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.support.work_units import WorkUnits
from suites.coding.modules.workers.support.worker_run_window import WorkerRunWindow


class WorkerRunWindows:
    """Finds the checkpoint windows a worker's commit completes: each window, among those of the tasks the
    worktree committed, whose open tasks are all in the worker's unit and all committed. A window with an
    open task of another actor gives none: its tests run on the branch once it is merged. The windows are read
    fresh, since the commit that asks moved its tasks to testing in the same request."""

    def __init__(self, plans: TaskPlans, checkpoints: PlanCheckpoints, units: WorkUnits) -> None:
        self.plans, self.checkpoints, self.units = plans, checkpoints, units

    def completed_by(self, worktree: Worktree) -> tuple[WorkerRunWindow, ...]:
        unit_ids = frozenset(self.units.unit(worktree.session_agent_id).task_ids)
        self.plans.prepare(worktree.commit_tasks())
        phases = [phase for phase in (self.plans.find_phase(task_id) for task_id in worktree.commit_tasks()) if phase is not None]
        plan_windows = {plan_id: self.checkpoints.windows(plan_id) for plan_id in {phase.plan_id for phase in phases}}
        checkpoints = {checkpoint.id: checkpoint for checkpoint in (plan_windows[phase.plan_id].window_checkpoint(phase.id) for phase in phases)}
        windows = (self.window(plan_windows[checkpoint.plan_id], checkpoint, unit_ids) for checkpoint in checkpoints.values())
        return tuple(window for window in windows if window is not None)

    @staticmethod
    def window(windows: CheckpointWindows, checkpoint: Phase, unit_ids: frozenset[int]) -> WorkerRunWindow | None:
        testing_ids = windows.testing_ids(checkpoint)
        unfinished_ids = windows.unfinished_ids(checkpoint)
        if not testing_ids or set(unfinished_ids) != set(testing_ids) or not unit_ids.issuperset(testing_ids):
            return None
        return WorkerRunWindow(checkpoint.plan_id, checkpoint.id, testing_ids)
