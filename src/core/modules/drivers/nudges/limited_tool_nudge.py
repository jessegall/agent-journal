from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class LimitedToolNudge(NudgeDeclaration):
    """The nudge drivers.limited_tool."""

    key = "drivers.limited_tool"
    type = NudgeType.SAFETY_REFUSAL
    text = "Read-only agents have no {tool}: say in your report what you need"
