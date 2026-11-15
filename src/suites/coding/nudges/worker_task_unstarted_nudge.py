from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class WorkerTaskUnstartedNudge(NudgeDeclaration):
    """The nudge coding.worker_task_not_started."""

    key = "coding.worker_task_not_started"
    type = NudgeType.REFUSAL
    text = "Your task has not started: only reads and journal commands run until it does"
