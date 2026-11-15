from engine.enums.command_category import CommandCategory
from engine.enums.tool_type import ToolType
from core.modules.drivers.rules.allowed_tools_rule import AllowedToolsRule
from core.modules.drivers.nudges.journal_restriction_nudge import JournalRestrictionNudge


class JournalCommandsRule(AllowedToolsRule):
    """Allows shell lines containing only journal commands."""

    name = "drivers.journal-only"
    allowed_tools = [ToolType.SHELL]
    allowed_commands = [CommandCategory.JOURNAL]
    refusal = JournalRestrictionNudge.declared()
