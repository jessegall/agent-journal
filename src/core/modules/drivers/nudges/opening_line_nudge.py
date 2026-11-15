from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class OpeningLineNudge(NudgeDeclaration):
    """The nudge drivers.opening_line."""

    key = "drivers.opening_line"
    type = NudgeType.NOTICE
    text = '{text}'
    turn_limited = False
