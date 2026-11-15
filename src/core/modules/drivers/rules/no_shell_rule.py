from engine.enums.tool_type import ToolType
from core.modules.drivers.rules.denied_tools_rule import DeniedToolsRule
from core.modules.drivers.nudges.shell_restriction_nudge import ShellRestrictionNudge


class NoShellRule(DeniedToolsRule):
    """Allows tools other than a shell."""

    name = "drivers.no-shell"
    denied_tools = [ToolType.SHELL]
    refusal = ShellRestrictionNudge.declared()
