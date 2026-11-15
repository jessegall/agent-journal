from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class PluginRefusalNudge(NudgeDeclaration):
    """The nudge plugins.plugin_refusal."""

    key = "plugins.plugin_refusal"
    type = NudgeType.REFUSAL
    text = "plugin:{plugin} refused this"
