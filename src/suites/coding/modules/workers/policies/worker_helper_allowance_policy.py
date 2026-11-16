from core.modules.helpers.commands.start_helper.start_helper import StartHelper
from suites.coding.modules.workers.agent_messages.worker_helper_ban_message import WorkerHelperBanMessage
from suites.coding.modules.workers.support.journal_command_allowance import JournalCommandAllowance
from suites.coding.modules.workers.support.worker_settings import WORKERS_START_HELPERS
from suites.coding.modules.workers.types.worker import Worker


class WorkerHelperAllowancePolicy(JournalCommandAllowance):
    """A worker starts no read-only helper while workers-start-read-only-helpers is off."""

    key = "workers.worker-helper-allowed"
    arguments = ("helper", "start")
    setting = WORKERS_START_HELPERS
    agent_types = [Worker.key]
    entry_point_commands = [StartHelper]

    def refusal_text(self) -> str:
        return WorkerHelperBanMessage.declared().agent_message().text
