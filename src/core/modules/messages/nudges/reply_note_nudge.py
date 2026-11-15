from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class ReplyNoteNudge(NudgeDeclaration):
    """The nudge messages.reply_note."""

    key = "messages.reply_note"
    type = NudgeType.STEERING
    text = "Message {message} answered: continue"
    turn_limited = False
