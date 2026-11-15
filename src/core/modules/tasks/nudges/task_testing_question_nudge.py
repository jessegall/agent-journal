from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class TaskTestingQuestionNudge(NudgeDeclaration):
    """The nudge tasks.testing_question."""

    key = "tasks.testing_question"
    type = NudgeType.STEERING
    text = "Did you mean to move task:{task} to testing first?"
    turn_limited = False
