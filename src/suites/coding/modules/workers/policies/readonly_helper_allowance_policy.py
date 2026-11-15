from core.modules.helpers.commands.start_helper.start_helper import StartHelper
from suites.coding.modules.workers.support.journal_command_allowance import JournalCommandAllowance
from suites.coding.nudges.main_helper_ban_message import MainHelperBanMessage
from suites.coding.support.coding_settings import STARTS_HELPERS_SETTING


class ReadonlyHelperAllowancePolicy(JournalCommandAllowance):
    """The main agent starts no read-only helper while main-starts-read-only-helpers is off."""

    key = "workers.helper-allowed"
    arguments = ("helper", "start")
    setting = STARTS_HELPERS_SETTING
    entrance_commands = [StartHelper]

    def refusal_text(self) -> str:
        return MainHelperBanMessage.declared().nudge(then=self.guidance.without_helpers()).text
