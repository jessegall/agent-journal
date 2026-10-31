from core.base.change.change import Change
from core.base.guard.guard import Guard
from core.base.model.model import Model
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.support.merge_checks import MergeChecks


class BaseBranchGuard(Guard):
    """Refuses to merge a worktree cut from a branch its environment no longer builds on."""

    name = "workers.base-branch-holds"
    event = "worker_worktree.merge"

    def __init__(self, checks: MergeChecks) -> None:
        self.checks = checks

    def check(self, change: Change[Model]) -> None:
        if isinstance(change.row, Worktree):
            self.checks.check_base_branch(change.row)
