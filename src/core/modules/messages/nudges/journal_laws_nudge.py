from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class JournalLawsNudge(NudgeDeclaration):
    """The nudge messages.journal_laws."""

    key = "messages.journal_laws"
    type = NudgeType.NOTICE
    text = "Laws L1 to L11 in JOURNAL.md apply to you"
