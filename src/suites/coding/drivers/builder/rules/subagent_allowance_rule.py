from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.base.driver.tool_type import ToolType
from core.modules.settings.bindings.support.setting_values import SettingValues
from suites.coding.coding_settings import SENDS_SUBAGENTS_SETTING



class SubagentAllowanceRule(DriverRule):
    """While the project setting coding.builder-sends-subagents is false, the builder's dispatch of a subagent is
    refused; it is true by default."""

    name = "coding.builder-subagent-allowance"
    hook = HookEventName.PRE_TOOL_USE

    def __init__(self, settings: SettingValues) -> None:
        self.settings = settings

    def answer(self, hook: AgentHook) -> RuleAnswer:
        tool = hook.event.tool
        if tool is None or tool.category is not ToolType.AGENT or self.settings.project_value(SENDS_SUBAGENTS_SETTING) is not False:
            return RuleAnswer.allowed()
        return RuleAnswer.refused("the builder sends no subagents here: read and search yourself")
