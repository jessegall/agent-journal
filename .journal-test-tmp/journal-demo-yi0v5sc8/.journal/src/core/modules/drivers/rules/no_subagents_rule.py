from core.base.driver.tool_type import ToolType
from core.modules.drivers.rules.denied_tools_rule import DeniedToolsRule
from core.modules.drivers.support.access_nudges import SUBAGENT_RESTRICTION


class NoSubagentsRule(DeniedToolsRule):
    """Allows tools other than dispatching a subagent."""

    name = "drivers.no-subagents"
    denied_tools = [ToolType.AGENT]
    refusal = SUBAGENT_RESTRICTION
