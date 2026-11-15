from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class WorkerNextTaskNudge(NudgeDeclaration):
    """The nudge workers.next_task."""

    key = "workers.next_task"
    type = NudgeType.STEERING
    text = "Your tests passed. Next: task:{task}. {line}"
    turn_limited = False
    path_fields = ["line"]
