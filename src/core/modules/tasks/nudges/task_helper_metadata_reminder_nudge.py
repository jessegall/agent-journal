from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class TaskHelperMetadataReminderNudge(NudgeDeclaration):
    """The nudge tasks.read_only_missing_metadata."""

    key = "tasks.read_only_missing_metadata"
    type = NudgeType.NOTICE
    text = "Task {task} is missing {missing}: ask the main agent to set it"
    turn_limited = False
