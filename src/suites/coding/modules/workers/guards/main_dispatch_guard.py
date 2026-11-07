from core.base.change.created import Created
from core.base.command.context import Context
from core.base.guard.guard import Guard
from core.base.refusal import Refusal
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.support.coding_main_options import CodingMainOptions
from suites.coding.support.main_caller import MainCaller


class MainDispatchGuard(Guard[Created[Worktree]]):
    """A main agent starts no worker or worker worktree while it may not send workers."""

    name = "workers.main-sends-no-worker"

    def __init__(self, caller: MainCaller, options: CodingMainOptions) -> None:
        self.caller, self.options = caller, options

    def check(self, event: Created[Worktree], context: Context) -> None:
        if self.caller.is_main(context) and not self.options.options().sends_workers:
            raise Refusal("the main agent sends no workers here", "a person turns on journal.suites.coding.workers.builder-dispatches-workers")
