from engine.driver.command_category import CommandCategory
from engine.driver.tool_type import ToolType
from core.modules.drivers.rules.allowed_tools_rule import AllowedToolsRule
from core.modules.drivers.support.access_nudges import JOURNAL_RESTRICTION


class JournalCommandsRule(AllowedToolsRule):
    """Allows shell lines containing only journal commands."""

    name = "drivers.journal-only"
    allowed_tools = [ToolType.SHELL]
    allowed_commands = [CommandCategory.JOURNAL]
    refusal = JOURNAL_RESTRICTION
