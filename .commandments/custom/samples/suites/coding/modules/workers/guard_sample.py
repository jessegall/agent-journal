import subprocess

from core.base.guard.guard import Guard
from core.base.refusal import Refusal
from suites.coding.modules.workers.support.worktree_git import WorktreeGit

LIMIT_SECONDS = 60


class CheckoutGuard(Guard):
    name = "samples.checkout"
    # @sin architecture_listeners_listener_event_named_by_a_string
    event = "worker_worktree.merge"

    # @sin architecture_workers_guard_runs_git
    def __init__(self, git: WorktreeGit, queries) -> None:
        self.git, self.queries = git, queries

    def check(self, change) -> None:
        head = self.git.head(change.row.folder)
        # @sin architecture_workers_guard_runs_git
        listed = subprocess.run(["ls", change.row.folder], timeout=LIMIT_SECONDS, check=False)
        # @righteous architecture_workers_guard_runs_git
        row = self.queries.query(change.row).filter(state="delivered").first()
        if head or listed or row:
            raise Refusal("the sample refuses")
