from engine.enums.agent_role import AgentRole
from suites.coding.nudges.main_helper_ban_nudge import MainHelperBanNudge
from suites.coding.support.coding_settings import STARTS_HELPERS_SETTING
from suites.coding.support.auto_advice import AutoAdvice
from engine.driver.agent_hook import AgentHook
from suites.coding.modules.workers.support.journal_command_allowance import JournalCommandAllowance
from engine.driver.driver_rule import DriverRule
from engine.enums.hook_event_name import HookEventName
from engine.driver.rule_answer import RuleAnswer
from engine.setting.setting_values import SettingValues

HELPER_START_ARGUMENTS = ("helper", "start")


class ReadonlyHelperAllowanceRule(DriverRule):
    """The main agent starts no read-only helpers while the setting main-starts-read-only-helpers is off."""

    name = "workers.helper-allowed"
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["coding.main"]
    roles = [AgentRole.MAIN]
    single_action_refusal = "The main agent starts no read-only helpers while the setting main-starts-read-only-helpers is off"

    def __init__(self, settings: SettingValues, guidance: AutoAdvice) -> None:
        self.settings, self.guidance = settings, guidance

    def answer(self, hook: AgentHook) -> RuleAnswer:
        starts = hook.event.tool is not None and JournalCommandAllowance.runs_command(hook.event.tool.shell, tuple(HELPER_START_ARGUMENTS))
        if not starts or self.settings.value(STARTS_HELPERS_SETTING) is not False:
            return RuleAnswer.allowed()
        return RuleAnswer.refused(MainHelperBanNudge.declared().nudge(then=self.guidance.without_helpers()))
