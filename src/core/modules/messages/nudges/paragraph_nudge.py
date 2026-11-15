from engine.driver.nudge_declaration import NudgeDeclaration
from engine.driver.interval import Interval
from engine.driver.seconds import Seconds
from engine.enums.nudge_type import NudgeType


class ParagraphNudge(NudgeDeclaration):
    """The nudge messages.blank_lines."""

    key = "messages.blank_lines"
    type = NudgeType.STEERING
    text = "Separate paragraphs with a blank line"
    interval = Interval(Seconds(600))
