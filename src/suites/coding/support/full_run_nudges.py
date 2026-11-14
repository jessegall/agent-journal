from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType

TESTING_TASKS_FULL_RUN = NudgeDeclaration("tasks.testing_tasks_full_run", NudgeType.NOTICE, "{tasks} are in testing: this full run closes them if it passes", turn_limited=False)
TESTING_TASKS_FAILED_RUN = NudgeDeclaration("tasks.testing_tasks_failed_run", NudgeType.NOTICE, "The full test run failed: {tasks} stay in testing", turn_limited=False)
