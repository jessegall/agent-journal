from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class TaskMetadataReminderNudge(NudgeDeclaration):
    """The nudge tasks.missing_metadata."""

    key = "tasks.missing_metadata"
    type = NudgeType.NOTICE
    text = "Task {task} is missing {missing}: set it"
    turn_limited = False
