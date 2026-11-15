from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class SkipApprovedNudge(NudgeDeclaration):
    """The nudge drivers.skip_approved."""

    key = "drivers.skip_approved"
    type = NudgeType.STEERING
    text = "Skip refusal-skip:{refusal} approved: try again"
    turn_limited = False
