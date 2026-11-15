from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class MessageNoteNudge(NudgeDeclaration):
    """The nudge messages.act_on_messages."""

    key = "messages.act_on_messages"
    type = NudgeType.NOTICE
    text = 'Act on the message: follow steering, create a task or edit an existing one, save memories worth keeping, then reply'
    turn_limited = False
