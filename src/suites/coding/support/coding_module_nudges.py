from suites.coding.support.coding_nudges import CODING_NUDGES
from suites.coding.nudges.testing_tasks_failed_run_message import TestingTasksFailedRunMessage
from suites.coding.nudges.testing_tasks_full_run_message import TestingTasksFullRunMessage
from suites.coding.support.graphify_nudges import TOOL_NUDGES

CODING_MODULE_NUDGES = [*CODING_NUDGES, TestingTasksFullRunMessage, TestingTasksFailedRunMessage, *TOOL_NUDGES]
