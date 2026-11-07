from suites.coding.support.coding_agent_role import CodingAgentRole as AgentRole
from suites.coding.support.coding_nudges import BUILDER_HELPER_BAN
from suites.coding.support.coding_settings import STARTS_HELPERS_SETTING
from core.base.driver.agent_hook import AgentHook
from core.base.driver.command_category import CommandCategory
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.modules.settings.bindings.support.setting_values import SettingValues

HELPER_START_ARGUMENTS = ("helper", "start")


class HelperAllowanceRule(DriverRule):
    """A builder starts no helpers while the setting coding.builder-starts-helpers is false."""

    name = "workers.helper-allowed"
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["coding.builder", "coding.orchestrator"]
    roles = [AgentRole.MAIN]

    def __init__(self, settings: SettingValues) -> None:
        self.settings = settings

    def answer(self, hook: AgentHook) -> RuleAnswer:
        shell = hook.event.tool.shell if hook.event.tool is not None else None
        starts = shell is not None and any(part.classification.category is CommandCategory.JOURNAL and tuple(part.arguments[:2]) == HELPER_START_ARGUMENTS for part in shell.parts)
        if not starts or self.settings.value(STARTS_HELPERS_SETTING) is not False:
            return RuleAnswer.allowed()
        return RuleAnswer.refused(BUILDER_HELPER_BAN.nudge())
