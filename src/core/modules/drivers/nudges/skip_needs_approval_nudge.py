from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class SkipNeedsApprovalNudge(NudgeDeclaration):
    """The nudge drivers.skip_waits_for_approval."""

    key = "drivers.skip_waits_for_approval"
    type = NudgeType.STEERING
    text = "agent:{agent} confirmed a skip that needs your answer: refusal-skip:{refusal}"
    turn_limited = False
