from engine.enums.command_category import CommandCategory
from engine.enums.tool_type import ToolType
from core.modules.drivers.rules.allowed_tools_rule import AllowedToolsRule
from core.modules.drivers.nudges.readonly_nudge import ReadonlyNudge


class ReadonlyRule(AllowedToolsRule):
    """Allows reads, searches and journal commands, while refusing file changes and other tools."""

    name = "drivers.readonly"
    allowed_tools = (ToolType.READ, ToolType.SEARCH, ToolType.SHELL)
    allowed_commands = tuple(category for category in CommandCategory if category.is_readonly)
    refusal = ReadonlyNudge.declared()
