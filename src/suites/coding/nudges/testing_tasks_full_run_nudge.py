from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class TestingTasksFullRunNudge(NudgeDeclaration):
    """The nudge tasks.testing_tasks_full_run."""

    key = "tasks.testing_tasks_full_run"
    type = NudgeType.NOTICE
    text = "{tasks} are in testing: this full run closes them if it passes"
    turn_limited = False
