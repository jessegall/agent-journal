from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class UnreadDisplayRefusalNudge(NudgeDeclaration):
    """The nudge messages.unread_show."""

    key = "messages.unread_show"
    type = NudgeType.REFUSAL
    text = "Message {message} is unread, so it cannot be shown: read it first"
