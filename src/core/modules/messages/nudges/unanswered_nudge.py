from engine.driver.nudge_declaration import NudgeDeclaration
from engine.driver.interval import Interval
from engine.driver.seconds import Seconds
from engine.enums.nudge_type import NudgeType


class UnansweredNudge(NudgeDeclaration):
    """The nudge messages.unanswered."""

    key = "messages.unanswered"
    type = NudgeType.STEERING
    text = "Answer message {messages} before continuing"
    interval = Interval(Seconds(300))
