from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class UnfinishedTasksNudge(NudgeDeclaration):
    """The nudge coding.unfinished_tasks."""

    key = "coding.unfinished_tasks"
    type = NudgeType.REFUSAL
    text = "Tasks {tasks} are yours and unfinished: start one, block it on what it waits for, or say why you stop"
