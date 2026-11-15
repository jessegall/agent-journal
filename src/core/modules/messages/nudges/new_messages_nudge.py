from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class NewMessagesNudge(NudgeDeclaration):
    """The nudge messages.new_messages."""

    key = "messages.new_messages"
    type = NudgeType.STEERING
    text = "{count} new messages: read them"
    turn_limited = False
