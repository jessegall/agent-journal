from engine.driver.nudge_declaration import NudgeDeclaration
from engine.driver.nudge_type import NudgeType

TESTING_TASKS_FULL_RUN = NudgeDeclaration("tasks.testing_tasks_full_run", NudgeType.NOTICE, '{tasks} wait in testing: this full test run closes them if it passes', turn_limited=False)
TESTING_TASKS_FAILED_RUN = NudgeDeclaration("tasks.testing_tasks_failed_run", NudgeType.NOTICE, 'the full test run failed: {tasks} stay in testing', turn_limited=False)
