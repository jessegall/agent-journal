from collections.abc import Sequence
from typing import ClassVar

from core.base.driver.agent_hook import AgentHook
from core.base.driver.rule_answer import RuleAnswer
from core.base.driver.tool_type import ToolType
from core.base.provider.providers import Providers
from core.modules.drivers.rules.allowed_command_types_rule import AllowedCommandTypesRule
from core.modules.drivers.support.access_nudges import TOOL_RESTRICTION


class AllowedToolsRule(AllowedCommandTypesRule):
    """Allows the tool types and shell command categories declared by a driver."""

    name = "drivers.allowed-tools"
    allowed_tools: ClassVar[Sequence[ToolType]] = tuple(ToolType)
    refusal = TOOL_RESTRICTION
    refuses_one_action = "Allows the tool types and shell command categories declared by a driver"

    def __init__(self, providers: Providers) -> None:
        self.providers = providers

    def answer(self, hook: AgentHook) -> RuleAnswer:
        tool = hook.event.tool
        if tool is not None and self.providers.provider(hook.event.program).uses_web_reader(hook.event):
            return RuleAnswer.allowed()
        if tool is not None and tool.category not in self.allowed_tools:
            return RuleAnswer.refused(self.refusal.nudge(category=tool.category.value))
        if tool is not None and tool.category is ToolType.SHELL and tool.shell is None:
            return RuleAnswer.refused(self.refusal.nudge(category=tool.category.value))
        return super().answer(hook)
