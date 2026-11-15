from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class WorkerOperationJobNudge(NudgeDeclaration):
    """The nudge workers.operation_job."""

    key = "workers.operation_job"
    type = NudgeType.STEERING
    text = 'worker:{worker} has the job: output {output}'
    turn_limited = False
    wakes_agent = True
