from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class ContextHardStopNudge(NudgeDeclaration):
    """The nudge workers.context_hard_stop."""

    key = "workers.context_hard_stop"
    type = NudgeType.REFUSAL
    text = "Your context passed the second limit: no more tools, stop now; it is being compacted"
    turn_limited = False
