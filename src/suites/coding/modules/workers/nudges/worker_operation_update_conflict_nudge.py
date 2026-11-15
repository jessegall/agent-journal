from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class WorkerOperationUpdateConflictNudge(NudgeDeclaration):
    """The nudge workers.operation_update_conflict."""

    key = "workers.operation_update_conflict"
    type = NudgeType.STEERING
    text = 'worker:{worker} update clashes: output {output}; settle the conflict markers, then commit'
    turn_limited = False
    wakes_agent = True
