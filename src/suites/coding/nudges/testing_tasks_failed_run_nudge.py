from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class TestingTasksFailedRunNudge(NudgeDeclaration):
    """The nudge tasks.testing_tasks_failed_run."""

    key = "tasks.testing_tasks_failed_run"
    type = NudgeType.NOTICE
    text = "The full test run failed: {tasks} stay in testing"
    turn_limited = False
