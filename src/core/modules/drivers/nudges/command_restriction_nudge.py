from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class CommandRestrictionNudge(NudgeDeclaration):
    """The nudge drivers.command_not_allowed."""

    key = "drivers.command_not_allowed"
    type = NudgeType.SAFETY_REFUSAL
    text = "This driver cannot run {category} commands"
