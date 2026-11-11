from core.modules.plans.support.plan_checkpoints import PlanCheckpoints
from core.modules.plans.support.task_plans import TaskPlans
from suites.coding.modules.workers.models.worktree import Worktree

WAIT_TEXT = "committed: the merger merges; tests run at the checkpoint of phase {phase}"
OPEN_TASKS_TEXT = ", when tasks {tasks} are in"


class CheckpointWaitText:
    """Says where the tests of a committed worktree run: at the next checkpoint of its plan, once the tasks of
    that checkpoint's window that are not submitted yet are in. A worktree that is not committed, or whose
    tests passed, has no such sentence."""

    def __init__(self, plans: TaskPlans, checkpoints: PlanCheckpoints) -> None:
        self.plans, self.checkpoints = plans, checkpoints

    def text(self, worktree: Worktree) -> str | None:
        phase = self.plans.find_phase(worktree.task_id)
        if phase is None or worktree.merge_ready_at is None or worktree.tests_passed_at is not None:
            return None
        windows = self.checkpoints.windows(phase.plan_id)
        checkpoint = windows.window_checkpoint(phase.id)
        testing_ids = windows.testing_ids(checkpoint)
        open_ids = [str(task_id) for task_id in windows.unfinished_ids(checkpoint) if task_id not in testing_ids]
        tail = OPEN_TASKS_TEXT.format(tasks=", ".join(open_ids)) if open_ids else ""
        return WAIT_TEXT.format(phase=checkpoint.id) + tail
