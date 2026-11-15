from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class WorkerTaskStartedNudge(NudgeDeclaration):
    """The nudge coding.worker_task_started."""

    key = "coding.worker_task_started"
    type = NudgeType.REFUSAL
    text = 'Not finished: {line}'
    path_fields = ["line"]
