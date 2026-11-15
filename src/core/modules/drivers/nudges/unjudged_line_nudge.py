from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class UnjudgedLineNudge(NudgeDeclaration):
    """The nudge drivers.unjudged_line."""

    key = "drivers.unjudged_line"
    type = NudgeType.SAFETY_REFUSAL
    text = "This line cannot be judged from its text: read with grep, or say in your report what should be run"
