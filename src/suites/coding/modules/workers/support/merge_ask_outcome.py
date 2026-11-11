from dataclasses import dataclass

from suites.coding.modules.workers.models.merge_ask import MergeAsk
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.support.work_unit import WorkUnit

ANSWER_TEXT = ("Asked for the merge of {unit}: {task_count} tasks in {commit_count} commits, up to {commit}. Now: stop. "
               "Then: you are told when it is merged, and started on your next unit if you have one.")


@dataclass(frozen=True)
class MergeAskOutcome:
    """The ask saved for a worker's merge, with the line the worker reads."""

    merge_ask: MergeAsk
    worktree: Worktree
    unit: WorkUnit

    def line(self) -> str:
        return ANSWER_TEXT.format(unit=self.unit.merge_name, task_count=self.unit.total_count, commit_count=self.worktree.commit_count, commit=self.merge_ask.commit_id)
