from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class JournalRestrictionNudge(NudgeDeclaration):
    """The nudge drivers.journal_only."""

    key = "drivers.journal_only"
    type = NudgeType.SAFETY_REFUSAL
    text = "This driver runs journal commands only"
