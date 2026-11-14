from suites.coding.support.coding_nudges import CODING_NUDGES
from suites.coding.support.full_run_nudges import TESTING_TASKS_FAILED_RUN
from suites.coding.support.full_run_nudges import TESTING_TASKS_FULL_RUN
from suites.coding.support.graphify_nudges import TOOL_NUDGES

CODING_MODULE_NUDGES = [*CODING_NUDGES, TESTING_TASKS_FULL_RUN, TESTING_TASKS_FAILED_RUN, *TOOL_NUDGES]
