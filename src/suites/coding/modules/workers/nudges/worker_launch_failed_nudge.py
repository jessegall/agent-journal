from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class WorkerLaunchFailedNudge(NudgeDeclaration):
    """The nudge workers.launch_failed."""

    key = "workers.launch_failed"
    type = NudgeType.STEERING
    text = "worker:{worker} failed to start: {line}"
    turn_limited = False
