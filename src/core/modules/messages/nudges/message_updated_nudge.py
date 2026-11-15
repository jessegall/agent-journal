from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class MessageUpdatedNudge(NudgeDeclaration):
    """The nudge messages.message_updated."""

    key = "messages.message_updated"
    type = NudgeType.NOTICE
    text = "message:{message} was updated: read it again"
