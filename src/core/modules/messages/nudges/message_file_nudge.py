from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class MessageFileNudge(NudgeDeclaration):
    """The nudge messages.message_file."""

    key = "messages.message_file"
    type = NudgeType.STEERING
    text = '  file .journal/files/message/{message}/{name}'
    turn_limited = False
