from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class ClosingLineHiddenNudge(NudgeDeclaration):
    """The nudge messages.one_line_closing."""

    key = "messages.one_line_closing"
    type = NudgeType.STEERING
    text = "Your reply was already sent, so your one closing line was not shown"
