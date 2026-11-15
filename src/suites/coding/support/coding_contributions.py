from suites.coding.policies.failed_full_run_policy import FailedFullRunPolicy
from suites.coding.policies.graphify_search_policy import GraphifySearchPolicy
from suites.coding.policies.worker_full_test_run_policy import WorkerFullTestRunPolicy
from suites.coding.lines.graphify_search_lines import GraphifySearchLines
from suites.coding.lines.introduction_lines import IntroductionLines
from suites.coding.lines.waiting_items_lines import WaitingItemsLines
from suites.coding.needs.worker_task_start_needs import WorkerTaskStartNeeds

# what the coding suite's own module gives the agent machine
CODING_NEEDS = [WorkerTaskStartNeeds]
CODING_LINES = [GraphifySearchLines, IntroductionLines, WaitingItemsLines]
CODING_POLICIES = [FailedFullRunPolicy, GraphifySearchPolicy, WorkerFullTestRunPolicy]
