from suites.coding.modules.workers.agent_messages.main_merge_ban_message import MainMergeBanMessage
from suites.coding.modules.workers.commands.merge_worker.merge_worker import MergeWorker
from suites.coding.modules.workers.support.journal_command_allowance import JournalCommandAllowance
from suites.coding.modules.workers.support.worker_settings import MAIN_MERGES_WORKERS


class MergeAllowancePolicy(JournalCommandAllowance):
    """The main agent merges no worker itself while main-agent-may-merge is off."""

    key = "workers.merge-allowed"
    arguments = ("worker", "merge")
    setting = MAIN_MERGES_WORKERS
    entry_point_commands = [MergeWorker]

    def refusal_text(self) -> str:
        return MainMergeBanMessage.declared().agent_message().text
