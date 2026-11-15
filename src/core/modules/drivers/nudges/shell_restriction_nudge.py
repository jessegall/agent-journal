from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class ShellRestrictionNudge(NudgeDeclaration):
    """The nudge drivers.no_shell."""

    key = "drivers.no_shell"
    type = NudgeType.SAFETY_REFUSAL
    text = "This driver runs no shell commands"
