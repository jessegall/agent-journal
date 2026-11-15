from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class WorkerRestartedNudge(NudgeDeclaration):
    """The nudge workers.restarted."""

    key = "workers.restarted"
    type = NudgeType.STEERING
    text = "worker:{worker} stopped with {tasks} left and was started again"
    turn_limited = False
