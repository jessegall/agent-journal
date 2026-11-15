from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class RepeatedClosingNudge(NudgeDeclaration):
    """The nudge messages.repeated_closing."""

    key = "messages.repeated_closing"
    type = NudgeType.STEERING
    text = "Your closing words repeat message {message}, so they were not shown"
