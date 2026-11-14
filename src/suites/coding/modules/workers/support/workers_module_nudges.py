from suites.coding.modules.workers.support.behind_nudges import STALE_NUDGES
from suites.coding.modules.workers.support.merger_nudges import MERGER_LINE_AVAILABLE
from suites.coding.modules.workers.support.merger_nudges import MERGER_PASSED
from suites.coding.modules.workers.support.merger_nudges import MERGE_HOOK_FAILED
from suites.coding.modules.workers.support.merger_nudges import UNIT_BLOCKED
from suites.coding.modules.workers.support.merger_nudges import UNIT_MERGED
from suites.coding.modules.workers.support.merger_nudges import UNIT_MERGE_WAITS
from suites.coding.modules.workers.support.merger_nudges import WORKER_MERGED
from suites.coding.modules.workers.support.merger_nudges import WORKER_WITHOUT_TASKS
from suites.coding.modules.workers.support.worker_nudges import WORKER_NUDGES
from suites.coding.modules.workers.support.worker_test_limit_nudges import TEST_COUNT_UNKNOWN
from suites.coding.modules.workers.support.worker_test_limit_nudges import TEST_LIMIT_REFUSAL
from suites.coding.modules.workers.support.worker_test_limit_nudges import TEST_LIMIT_STOP

WORKERS_MODULE_NUDGES = [MERGE_HOOK_FAILED, UNIT_BLOCKED, UNIT_MERGE_WAITS, UNIT_MERGED, WORKER_WITHOUT_TASKS, MERGER_LINE_AVAILABLE, WORKER_MERGED, MERGER_PASSED, *WORKER_NUDGES, *STALE_NUDGES, TEST_COUNT_UNKNOWN, TEST_LIMIT_STOP, TEST_LIMIT_REFUSAL]
