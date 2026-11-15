from engine.chat.mark_category import MarkCategory
from engine.enums.mark_group import MarkGroup

BYPASS_FAMILY = MarkCategory("drivers.bypass", "Unchecked work", "stop", MarkGroup.JOURNAL)

REQUIRED_COMMANDS_FAMILY = MarkCategory("drivers.required_commands", "Skipped lines", "stop", MarkGroup.JOURNAL)
