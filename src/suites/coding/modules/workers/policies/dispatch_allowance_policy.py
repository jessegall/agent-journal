from suites.coding.modules.workers.commands.dispatch_worker.dispatch_worker import DispatchWorker
from suites.coding.modules.workers.nudges.main_workers_refused_nudge import MainWorkersRefusedNudge
from suites.coding.modules.workers.support.dispatch_arguments import DISPATCH_ARGUMENTS
from suites.coding.modules.workers.support.journal_command_allowance import JournalCommandAllowance
from suites.coding.modules.workers.support.worker_settings import DISPATCHES_WORKERS_SETTING


class DispatchAllowancePolicy(JournalCommandAllowance):
    """The main agent dispatches no worker while main-dispatches-workers is off."""

    key = "workers.dispatch-allowed"
    arguments = tuple(DISPATCH_ARGUMENTS)
    setting = DISPATCHES_WORKERS_SETTING
    entrance_commands = [DispatchWorker]

    def refusal_text(self) -> str:
        return MainWorkersRefusedNudge.declared().nudge(then=self.guidance.without_workers()).text
