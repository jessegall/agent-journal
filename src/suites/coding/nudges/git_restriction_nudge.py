from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class GitRestrictionNudge(NudgeDeclaration):
    """The nudge drivers.no_git."""

    key = "drivers.no_git"
    type = NudgeType.SAFETY_REFUSAL
    text = "This driver runs no git commands"
