from core.modules.helpers.commands.start_helper.start_helper import StartHelper
from suites.coding.modules.workers.rules.readonly_helper_allowance_rule import HELPER_START_ARGUMENTS
from suites.coding.modules.workers.support.journal_command_allowance import JournalCommandAllowance
from suites.coding.nudges.main_helper_ban_nudge import MainHelperBanNudge
from suites.coding.support.coding_settings import STARTS_HELPERS_SETTING


class ReadonlyHelperAllowancePolicy(JournalCommandAllowance):
    """The main agent starts no read-only helper while main-starts-read-only-helpers is off."""

    key = "workers.helper-allowed"
    arguments = HELPER_START_ARGUMENTS
    setting = STARTS_HELPERS_SETTING
    entrance_commands = [StartHelper]

    def refusal_text(self) -> str:
        return MainHelperBanNudge.declared().nudge(then=self.guidance.without_helpers()).text
