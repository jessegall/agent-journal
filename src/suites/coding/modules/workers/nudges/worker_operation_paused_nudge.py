from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class WorkerOperationPausedNudge(NudgeDeclaration):
    """The nudge workers.operation_paused."""

    key = "workers.operation_paused"
    type = NudgeType.STEERING
    text = "worker:{worker} is paused: the job waits until it is resumed"
    turn_limited = False
    wakes_agent = True
