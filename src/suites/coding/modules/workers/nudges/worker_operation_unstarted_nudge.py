from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class WorkerOperationUnstartedNudge(NudgeDeclaration):
    """The nudge workers.operation_never_started."""

    key = "workers.operation_never_started"
    type = NudgeType.STEERING
    text = "Worker command never started and changed nothing: give it again; output {output}"
    turn_limited = False
    wakes_agent = True
