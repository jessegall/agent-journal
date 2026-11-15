from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class WorkerTaskCommentNudge(NudgeDeclaration):
    """The nudge workers.task_comment."""

    key = "workers.task_comment"
    type = NudgeType.STEERING
    text = "The user commented on task:{task}: read it"
    turn_limited = False
    plural_text = 'the user commented on tasks {task}'
    id_field = "task"
