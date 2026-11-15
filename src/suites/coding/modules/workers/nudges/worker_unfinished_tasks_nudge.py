from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class WorkerUnfinishedTasksNudge(NudgeDeclaration):
    """The nudge workers.unfinished_tasks."""

    key = "workers.unfinished_tasks"
    type = NudgeType.STEERING
    text = "You ended with tasks left, {tasks}: {line}"
    path_fields = ["line"]
