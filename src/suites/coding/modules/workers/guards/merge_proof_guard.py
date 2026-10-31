from core.base.change.change import Change
from core.base.guard.guard import Guard
from core.base.model.model import Model
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.support.merge_checks import MergeChecks


class MergeProofGuard(Guard):
    """Refuses to merge a worktree while a proof of it is not checked."""

    name = "workers.merge-needs-checks"
    event = "worker_worktree.merge"

    def __init__(self, checks: MergeChecks) -> None:
        self.checks = checks

    def check(self, change: Change[Model]) -> None:
        if isinstance(change.row, Worktree):
            self.checks.check_proofs(change.row)
