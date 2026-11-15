from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class ProgramRestrictionNudge(NudgeDeclaration):
    """The nudge drivers.program_not_allowed."""

    key = "drivers.program_not_allowed"
    type = NudgeType.SAFETY_REFUSAL
    text = "This driver cannot run {program}"
