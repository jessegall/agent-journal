from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class UnreadMessageStopNudge(NudgeDeclaration):
    """The nudge messages.unread_at_stop."""

    key = "messages.unread_at_stop"
    type = NudgeType.REFUSAL
    text = "Message {message} is unread: read it before you stop"
