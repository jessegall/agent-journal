from suites.coding.support.coding_nudges import BUILDER_SUBAGENT_BAN
from core.base.driver.agent_hook import AgentHook
from core.modules.drivers.rules.no_subagents_rule import NoSubagentsRule
from core.base.driver.rule_answer import RuleAnswer
from core.base.driver.tool_type import ToolType
from core.modules.settings.bindings.support.setting_values import SettingValues
from suites.coding.support.coding_settings import SENDS_SUBAGENTS_SETTING



class SubagentAllowanceRule(NoSubagentsRule):
    """While the project setting coding.builder-sends-subagents is false, the builder's dispatch of a subagent
    is refused; it is true by default."""

    name = "coding.builder-subagent-allowance"
    exempt = False
    refusal = BUILDER_SUBAGENT_BAN

    def __init__(self, settings: SettingValues) -> None:
        self.settings = settings

    def answer(self, hook: AgentHook) -> RuleAnswer:
        tool = hook.event.tool
        if tool is None or tool.category is not ToolType.AGENT or self.settings.project_value(SENDS_SUBAGENTS_SETTING) is not False:
            return RuleAnswer.allowed()
        return super().answer(hook)
