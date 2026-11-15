from engine.chat.mark_category import MarkCategory
from engine.enums.mark_group import MarkGroup

HELPERS_FAMILY = MarkCategory("agents.helpers", "Helpers", "subagent", MarkGroup.AGENT)
MENUS_FAMILY = MarkCategory("agents.menus", "Terminal menus", "terminal", MarkGroup.JOURNAL)
LAUNCHERS_FAMILY = MarkCategory("agents.launchers", "Launchers", "terminal", MarkGroup.JOURNAL)
PROGRAM_SETTINGS_FAMILY = MarkCategory("agents.program-settings", "Program settings", "terminal", MarkGroup.JOURNAL)
