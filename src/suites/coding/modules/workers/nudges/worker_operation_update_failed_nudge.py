from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class WorkerOperationUpdateFailedNudge(NudgeDeclaration):
    """The nudge workers.operation_update_failed."""

    key = "workers.operation_update_failed"
    type = NudgeType.STEERING
    text = 'worker:{worker} update failed and changed nothing: output {output}'
    turn_limited = False
    wakes_agent = True
