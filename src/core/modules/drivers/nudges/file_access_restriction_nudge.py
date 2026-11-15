from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class FileAccessRestrictionNudge(NudgeDeclaration):
    """The nudge drivers.read_and_writes_only."""

    key = "drivers.read_and_writes_only"
    type = NudgeType.SAFETY_REFUSAL
    text = "This driver only reads and writes files, plus journal commands"
