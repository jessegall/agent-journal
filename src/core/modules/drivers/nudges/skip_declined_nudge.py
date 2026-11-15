from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class SkipDeclinedNudge(NudgeDeclaration):
    """The nudge drivers.skip_declined."""

    key = "drivers.skip_declined"
    type = NudgeType.STEERING
    text = "Skip refusal-skip:{refusal} declined: do what the refusal asks"
    turn_limited = False
