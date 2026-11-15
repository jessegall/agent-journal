from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class WorkerTaskExpectedNudge(NudgeDeclaration):
    """The nudge workers.committed_task_awaited."""

    key = "workers.committed_task_awaited"
    type = NudgeType.STEERING
    text = "worker:{worker} waits on your committed task:{task}; to share it early, ask with --up-to {task}"
    turn_limited = False
    id_field = "task"
