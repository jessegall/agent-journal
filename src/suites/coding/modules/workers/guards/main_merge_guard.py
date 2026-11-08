from core.base.change.moved import Moved
from core.base.command.context import Context
from core.base.guard.guard import Guard
from core.base.refusal import Refusal
from suites.coding.modules.workers.models.lifecycles.worktree_lifecycle import WorktreeLifecycle
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.support.coding_main_options import CodingMainOptions
from suites.coding.support.main_caller import MainCaller


class MainMergeGuard(Guard[Moved[Worktree]]):
    """A main agent merges no worker itself while it may not merge; the merger or a person takes the work in."""

    name = "workers.main-merges-no-worker"
    moves = tuple([WorktreeLifecycle.merge])

    def __init__(self, caller: MainCaller, options: CodingMainOptions) -> None:
        self.caller, self.options = caller, options

    def check(self, event: Moved[Worktree], context: Context) -> None:
        if self.caller.is_main(context) and not self.options.options().may_merge:
            raise Refusal("the main agent merges no worker here", "a person turns on journal.suites.coding.workers.main-agent-may-merge")
