from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class ContextStopAfterTaskNudge(NudgeDeclaration):
    """The nudge workers.context_stop_between_tasks."""

    key = "workers.context_stop_between_tasks"
    type = NudgeType.STEERING
    text = "Your context passed the limit between tasks: stop now; stopping compacts it and you continue after"
    turn_limited = False
