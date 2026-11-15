from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class AliasPluginOffNudge(NudgeDeclaration):
    """The nudge aliases.plugin_off."""

    key = "aliases.plugin_off"
    type = NudgeType.REFUSAL
    text = "This line's alias belongs to plugin:{plugin}, which is switched off: run it another way or ask to switch it on"
