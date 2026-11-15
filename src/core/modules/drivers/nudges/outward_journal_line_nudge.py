from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class OutwardJournalLineNudge(NudgeDeclaration):
    """The nudge drivers.outward_journal_line."""

    key = "drivers.outward_journal_line"
    type = NudgeType.SAFETY_REFUSAL
    text = "This command reaches outside the journal: say in your report what should be run"
