from engine.enums.agent_role import AgentRole
from suites.coding.support.coding_nudges import MAIN_HELPER_BAN
from suites.coding.support.coding_settings import STARTS_HELPERS_SETTING
from suites.coding.support.auto_advice import AutoAdvice
from engine.driver.agent_hook import AgentHook
from engine.driver.command_category import CommandCategory
from engine.driver.driver_rule import DriverRule
from engine.driver.hook_event_name import HookEventName
from engine.driver.rule_answer import RuleAnswer
from core.modules.settings.bindings.support.setting_values import SettingValues

HELPER_START_ARGUMENTS = ("helper", "start")


class HelperAllowanceRule(DriverRule):
    """The main agent starts no read-only helpers while the setting main-starts-read-only-helpers is off."""

    name = "workers.helper-allowed"
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["coding.main"]
    roles = [AgentRole.MAIN]
    refuses_one_action = "The main agent starts no read-only helpers while the setting main-starts-read-only-helpers is off"

    def __init__(self, settings: SettingValues, guidance: AutoAdvice) -> None:
        self.settings, self.guidance = settings, guidance

    def answer(self, hook: AgentHook) -> RuleAnswer:
        shell = hook.event.tool.shell if hook.event.tool is not None else None
        starts = shell is not None and any(part.classification.category is CommandCategory.JOURNAL and tuple(part.arguments[:2]) == HELPER_START_ARGUMENTS for part in shell.parts)
        if not starts or self.settings.value(STARTS_HELPERS_SETTING) is not False:
            return RuleAnswer.allowed()
        return RuleAnswer.refused(MAIN_HELPER_BAN.nudge(then=self.guidance.without_helpers()))
