from engine.chat.mark_family import MarkFamily
from engine.enums.mark_group import MarkGroup

HELPERS_FAMILY = MarkFamily("agents.helpers", "Helpers", "subagent", MarkGroup.AGENT)
MENUS_FAMILY = MarkFamily("agents.menus", "Terminal menus", "terminal", MarkGroup.JOURNAL)
LAUNCHERS_FAMILY = MarkFamily("agents.launchers", "Launchers", "terminal", MarkGroup.JOURNAL)
PROGRAM_SETTINGS_FAMILY = MarkFamily("agents.program-settings", "Program settings", "terminal", MarkGroup.JOURNAL)
