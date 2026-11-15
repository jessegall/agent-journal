from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class JournalLineNoteNudge(NudgeDeclaration):
    """The nudge messages.journal_line."""

    key = "messages.journal_line"
    type = NudgeType.STEERING
    text = "A [journal] line is an instruction, not a message: act on it, never answer or mention it in the chat"
