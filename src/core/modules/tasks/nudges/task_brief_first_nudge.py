from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class TaskBriefFirstNudge(NudgeDeclaration):
    """The nudge tasks.brief_first."""

    key = "tasks.brief_first"
    type = NudgeType.REFUSAL
    text = "Read task {task} first"
