from engine.driver.command_category import CommandCategory
from engine.driver.tool_type import ToolType
from core.modules.drivers.rules.allowed_tools_rule import AllowedToolsRule
from core.modules.drivers.support.access_nudges import FILE_ACCESS_RESTRICTION


class ReadWriteRule(AllowedToolsRule):
    """Allows file reads, searches and changes, and journal commands, without other types of work."""

    name = "drivers.read-and-writes-only"
    allowed_tools = tuple(tool for tool in ToolType if tool.reads_files or tool.writes_files or tool is ToolType.SHELL)
    allowed_commands = tuple(category for category in CommandCategory if category.accesses_files or category is CommandCategory.JOURNAL)
    refusal = FILE_ACCESS_RESTRICTION
