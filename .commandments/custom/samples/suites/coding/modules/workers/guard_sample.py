import subprocess

from core.base.guard.guard import Guard
from core.base.refusal import Refusal
from suites.coding.modules.workers.support.worktree_git import WorktreeGit

LIMIT_SECONDS = 60


class CheckoutGuard(Guard):
    name = "samples.checkout"
    event = "worker_worktree.merge"

    # @sin architecture_workers_GuardReadsRowsOnlyDetector
    def __init__(self, git: WorktreeGit, queries) -> None:
        self.git, self.queries = git, queries

    def check(self, change) -> None:
        head = self.git.head(change.row.folder)
        # @sin architecture_workers_GuardReadsRowsOnlyDetector
        listed = subprocess.run(["ls", change.row.folder], timeout=LIMIT_SECONDS, check=False)
        # @righteous architecture_workers_GuardReadsRowsOnlyDetector
        rows = self.queries.query(change.row).filter(state="delivered").page(1, 1).rows
        if head or listed or rows:
            raise Refusal("the sample refuses")
