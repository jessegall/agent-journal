from engine.driver.command_category import CommandCategory
from engine.driver.tool_type import ToolType
from core.modules.drivers.rules.allowed_tools_rule import AllowedToolsRule
from core.modules.drivers.support.access_nudges import READONLY


class ReadonlyRule(AllowedToolsRule):
    """Allows reads, searches and journal commands, while refusing file changes and other tools."""

    name = "drivers.readonly"
    allowed_tools = (ToolType.READ, ToolType.SEARCH, ToolType.SHELL)
    allowed_commands = tuple(category for category in CommandCategory if category.is_readonly)
    refusal = READONLY
