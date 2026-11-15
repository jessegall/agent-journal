from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class WorkerOperationConflictNudge(NudgeDeclaration):
    """The nudge workers.operation_conflict."""

    key = "workers.operation_conflict"
    type = NudgeType.STEERING
    text = 'worker:{worker} has a merge conflict: output {output}'
    turn_limited = False
    wakes_agent = True
