from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class WorkerOperationFailedNudge(NudgeDeclaration):
    """The nudge workers.operation_failed."""

    key = "workers.operation_failed"
    type = NudgeType.STEERING
    text = "Worker command failed: output {output}"
    turn_limited = False
    wakes_agent = True
