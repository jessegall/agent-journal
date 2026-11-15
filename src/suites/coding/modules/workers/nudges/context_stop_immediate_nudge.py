from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class ContextStopImmediateNudge(NudgeDeclaration):
    """The nudge workers.context_stop_now."""

    key = "workers.context_stop_now"
    type = NudgeType.STEERING
    text = "Your context passed the limit and you hold no task: stop now; stopping compacts it"
    turn_limited = False
