from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class ReadonlyNudge(NudgeDeclaration):
    """The nudge drivers.readonly."""

    key = "drivers.readonly"
    type = NudgeType.SAFETY_REFUSAL
    text = "This driver only reads and searches, plus journal commands"
