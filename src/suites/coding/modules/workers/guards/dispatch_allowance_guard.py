from engine.event.created import Created
from engine.command.context import Context
from engine.guard.guard import Guard
from engine.errors.refusal import Refusal
from core.modules.drivers.support.command_check import CommandCheck
from suites.coding.modules.workers.commands.dispatch_worker.dispatch_worker import DispatchWorker
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.support.coding_main_options import CodingMainOptions
from suites.coding.support.main_caller import MainCaller


class DispatchAllowanceGuard(Guard[Created[Worktree]]):
    """A main agent starts no worker or worker worktree while it may not send workers."""

    name = "workers.main-sends-no-worker"

    def __init__(self, caller: MainCaller, options: CodingMainOptions, admission: CommandCheck) -> None:
        self.caller, self.options, self.admission = caller, options, admission

    def check(self, event: Created[Worktree], context: Context) -> None:
        # once the admission slice answers the agent, the entry point asks the hook's policy (doc 1310 section 10.9)
        if self.admission.answers(context):
            self.admission.admit(DispatchWorker, context)
            return
        if self.caller.is_main(context) and not self.options.options().sends_workers:
            raise Refusal("the main agent sends no workers here", "a user turns on journal.suites.coding.workers.main-dispatches-workers")
