from engine.chat.mark_family import MarkFamily
from engine.enums.mark_group import MarkGroup

BYPASS_FAMILY = MarkFamily("drivers.bypass", "Unchecked work", "stop", MarkGroup.JOURNAL)

REQUIRED_COMMANDS_FAMILY = MarkFamily("drivers.required_commands", "Skipped lines", "stop", MarkGroup.JOURNAL)
