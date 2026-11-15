from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class UnreadRefusalNudge(NudgeDeclaration):
    """The nudge messages.unread_held."""

    key = "messages.unread_held"
    type = NudgeType.REFUSAL
    text = "{count} unread messages: read them before any other write"
    turn_limited = False
