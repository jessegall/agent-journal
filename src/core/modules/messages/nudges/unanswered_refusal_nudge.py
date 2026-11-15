from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class UnansweredRefusalNudge(NudgeDeclaration):
    """The nudge messages.unanswered_held."""

    key = "messages.unanswered_held"
    type = NudgeType.REFUSAL
    text = "Answer message {messages} first"
    turn_limited = False
