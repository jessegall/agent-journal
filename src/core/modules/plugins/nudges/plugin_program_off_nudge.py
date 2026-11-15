from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class PluginProgramOffNudge(NudgeDeclaration):
    """The nudge plugins.program_off."""

    key = "plugins.program_off"
    type = NudgeType.REFUSAL
    text = "This program belongs to plugin {plugin}, which is switched off or not installed"
    id_field = "plugin"
