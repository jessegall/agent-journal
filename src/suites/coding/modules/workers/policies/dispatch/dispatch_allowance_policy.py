from suites.coding.modules.workers.commands.dispatch_worker.dispatch_worker import DispatchWorker
from suites.coding.modules.workers.agent_messages.main_workers_refusal_message import MainWorkersRefusalMessage
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
        return MainWorkersRefusalMessage.declared().agent_message(then=self.guidance.without_workers()).text
