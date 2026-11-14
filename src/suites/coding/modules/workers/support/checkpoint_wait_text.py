from collections.abc import Sequence

from core.modules.plans.support.checkpoint_windows import CheckpointWindows
from core.modules.plans.support.plan_checkpoints import PlanCheckpoints
from core.modules.plans.support.task_plans import TaskPlans
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.support.worktree_runs import WorktreeRuns

TESTS_TEXT = "tests run at the checkpoint of phase {phase}"
WAIT_TEXT = "committed; " + TESTS_TEXT
OPEN_TASKS_TEXT = ", when tasks {tasks} are in"
MERGED_TEXT = "merged into {branch}"
CHECKPOINT_MERGED_TEXT = "merged; its tests run at the checkpoint of phase {phase}"
WORKER_RUN_MERGED_TEXT = "merged; tested at the checkpoint of phase {phase} on commit {commit}"


class CheckpointWaitText:
    """Says where the tests of a committed worktree run: at the next checkpoint of its plan, once the tasks of
    that checkpoint's window that are not submitted yet are in. A worktree that is not committed, or whose
    tests passed, has no such sentence. It also gives the reason each merged task is closed with: in a started
    plan the checkpoint its tests run at."""

    def __init__(self, plans: TaskPlans, checkpoints: PlanCheckpoints, runs: WorktreeRuns) -> None:
        self.plans, self.checkpoints, self.runs = plans, checkpoints, runs

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

    def tests_text(self, task_id: int) -> str | None:
        phase = self.plans.find_phase(task_id)
        if phase is None:
            return None
        return TESTS_TEXT.format(phase=self.checkpoints.windows(phase.plan_id).window_checkpoint(phase.id).id)

    def merged_reasons(self, worktree: Worktree, task_ids: Sequence[int]) -> dict[int, str]:
        self.plans.prepare(task_ids)
        plan_windows = dict[int, CheckpointWindows]()
        reasons = dict[int, str]()
        passed_commits = self.runs.passed_commits(worktree.id)
        for task_id in task_ids:
            phase = self.plans.find_phase(task_id)
            if phase is None or not self.plans.is_started_plan(task_id):
                reasons[task_id] = MERGED_TEXT.format(branch=worktree.base_branch)
                continue
            if phase.plan_id not in plan_windows:
                plan_windows[phase.plan_id] = self.checkpoints.windows(phase.plan_id)
            checkpoint_id = plan_windows[phase.plan_id].window_checkpoint(phase.id).id
            commit = passed_commits.get(checkpoint_id)
            reasons[task_id] = CHECKPOINT_MERGED_TEXT.format(phase=checkpoint_id) if commit is None else WORKER_RUN_MERGED_TEXT.format(phase=checkpoint_id, commit=commit)
        return reasons
