from dataclasses import dataclass

from suites.coding.modules.workers.models.merge_ask import MergeAsk
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.support.work_unit import WorkUnit

PART_TEXT = "Asked for the merge up to commit {commit}: {task_count} tasks, with every commit before it. Your later commits stay in your worktree. Go on with your unit."
ANSWER_TEXT = ("Asked for the merge of {unit}: {task_count} tasks in {commit_count} commits, up to {commit}. Now: stop. "
               "Then: you are told when it is merged, and started on your next unit if you have one.")


@dataclass(frozen=True)
class MergeAskOutcome:
    """The ask saved for a worker's merge, with the line the worker reads."""

    merge_request: MergeAsk
    worktree: Worktree
    unit: WorkUnit

    def line(self) -> str:
        if not self.merge_request.is_whole:
            return PART_TEXT.format(commit=self.merge_request.commit_id, task_count=len(self.merge_request.tasks()))
        return ANSWER_TEXT.format(unit=self.unit.merge_name, task_count=self.unit.total_count, commit_count=self.worktree.commit_count, commit=self.merge_request.commit_id)
