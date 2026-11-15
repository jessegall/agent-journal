from suites.coding.support.coding_nudges import CODING_NUDGES
from suites.coding.nudges.testing_tasks_failed_run_nudge import TestingTasksFailedRunNudge
from suites.coding.nudges.testing_tasks_full_run_nudge import TestingTasksFullRunNudge
from suites.coding.support.graphify_nudges import TOOL_NUDGES

CODING_MODULE_NUDGES = [*CODING_NUDGES, TestingTasksFullRunNudge, TestingTasksFailedRunNudge, *TOOL_NUDGES]
