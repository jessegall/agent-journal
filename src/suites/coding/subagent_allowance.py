from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.rule_answer import RuleAnswer
from core.modules.settings.setting_values import SettingValues

SENDS_SUBAGENTS_SETTING = "coding.builder-sends-subagents"


class SubagentAllowance(DriverRule):
    """While the project setting coding.builder-sends-subagents is false, the builder's dispatch of a subagent is
    refused; it is true by default."""

    name = "coding.builder-subagent-allowance"
    hook = "pre_tool_use"

    def __init__(self, settings: SettingValues) -> None:
        self.settings = settings

    def answer(self, hook: AgentHook) -> RuleAnswer:
        tool = hook.event.tool
        if tool is None or tool.category != "agent" or self.settings.project_value(SENDS_SUBAGENTS_SETTING, True) is not False:
            return RuleAnswer.allowed()
        return RuleAnswer.refused("the builder sends no subagents here: read and search yourself")
