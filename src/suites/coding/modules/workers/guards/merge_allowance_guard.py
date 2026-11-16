from engine.event.moved import Moved
from engine.command.context import Context
from engine.guard.guard import Guard
from suites.coding.modules.workers.models.lifecycles.worktree_lifecycle import WorktreeLifecycle
from suites.coding.modules.workers.models.worktree import Worktree
from core.modules.drivers.support.command_check import CommandCheck
from suites.coding.modules.workers.commands.merge_worker.merge_worker import MergeWorker


class MergeAllowanceGuard(Guard[Moved[Worktree]]):
    """A main agent merges no worker itself while it may not merge; the merger or a user takes the work in."""

    name = "workers.main-merges-no-worker"
    moves = (WorktreeLifecycle.merge,)

    def __init__(self, start_check: CommandCheck) -> None:
        self.start_check = start_check

    # the merge asks the hook's policy, workers.merge-allowed, at its entry point (doc 1310 section 10.9)
    def check(self, event: Moved[Worktree], context: Context) -> None:
        if self.start_check.answers(context):
            self.start_check.admit(MergeWorker, context)
