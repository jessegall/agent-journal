from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class CutJournalCommandNudge(NudgeDeclaration):
    """The nudge processes.cut_journal_command."""

    key = "processes.cut_journal_command"
    type = NudgeType.REFUSAL
    text = "Do not pipe a journal command: use its flags"
