from engine.guard.guard import Guard
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.support.merge_checks import MergeChecks
from core.base.change.moved import Moved
from core.base.command.context import Context
from suites.coding.modules.workers.models.lifecycles.worktree_lifecycle import WorktreeLifecycle


class BaseBranchGuard(Guard[Moved[Worktree]]):
    """Refuses to merge a worktree cut from a branch its environment no longer builds on."""

    name = "workers.base-branch-holds"
    moves = tuple([WorktreeLifecycle.merge])

    def __init__(self, checks: MergeChecks) -> None:
        self.checks = checks

    def check(self, event: Moved[Worktree], context: Context) -> None:
        self.checks.check_base_branch(event.row)
