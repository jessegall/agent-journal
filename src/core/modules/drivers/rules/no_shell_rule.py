from core.base.driver.tool_type import ToolType
from core.modules.drivers.rules.denied_tools_rule import DeniedToolsRule
from core.modules.drivers.support.access_nudges import SHELL_RESTRICTION


class NoShellRule(DeniedToolsRule):
    """Allows tools other than a shell."""

    name = "drivers.no-shell"
    denied_tools = [ToolType.SHELL]
    refusal = SHELL_RESTRICTION
