from collections.abc import Sequence
from typing import ClassVar

from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.nudge_declaration import NudgeDeclaration
from core.base.driver.rule_answer import RuleAnswer
from core.base.driver.tool_type import ToolType
from core.modules.drivers.support.access_nudges import TOOL_RESTRICTION


class DeniedToolsRule(DriverRule):
    """Refuses tool types a driver excludes, leaving other tools to their own rules."""

    name = "drivers.denied-tools"
    hook = HookEventName.PRE_TOOL_USE
    exempt = True
    denied_tools: ClassVar[Sequence[ToolType]] = ()
    refusal: ClassVar[NudgeDeclaration] = TOOL_RESTRICTION
    refuses_one_action = "Refuses tool types a driver excludes, leaving other tools to their own rules"

    def answer(self, hook: AgentHook) -> RuleAnswer:
        tool = hook.event.tool
        if tool is not None and tool.category in self.denied_tools:
            return RuleAnswer.refused(self.refusal.nudge(category=tool.category.value))
        return RuleAnswer.allowed()
