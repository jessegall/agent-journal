from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class ToolRestrictionNudge(NudgeDeclaration):
    """The nudge drivers.tool_not_allowed."""

    key = "drivers.tool_not_allowed"
    type = NudgeType.SAFETY_REFUSAL
    text = "This driver allows no {category} tools"
