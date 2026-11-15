from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class NewMessageNudge(NudgeDeclaration):
    """The nudge messages.new_message."""

    key = "messages.new_message"
    type = NudgeType.STEERING
    text = "New message {message}: read it"
    turn_limited = False
