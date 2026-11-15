from suites.coding.modules.workers.support.behind_nudges import STALE_NUDGES
from suites.coding.modules.workers.nudges.merger_line_available_nudge import MergerLineAvailableNudge
from suites.coding.modules.workers.nudges.merger_passed_nudge import MergerPassedNudge
from suites.coding.modules.workers.nudges.merge_hook_failed_nudge import MergeHookFailedNudge
from suites.coding.modules.workers.nudges.unit_blocked_nudge import UnitBlockedNudge
from suites.coding.modules.workers.nudges.unit_merged_nudge import UnitMergedNudge
from suites.coding.modules.workers.nudges.unit_merge_waits_nudge import UnitMergeWaitsNudge
from suites.coding.modules.workers.nudges.worker_merged_nudge import WorkerMergedNudge
from suites.coding.modules.workers.nudges.worker_without_tasks_nudge import WorkerWithoutTasksNudge
from suites.coding.modules.workers.support.worker_nudges import WORKER_NUDGES
from suites.coding.modules.workers.nudges.test_count_unknown_nudge import TestCountUnknownNudge
from suites.coding.modules.workers.nudges.test_limit_refusal_nudge import TestLimitRefusalNudge
from suites.coding.modules.workers.nudges.test_limit_stop_nudge import TestLimitStopNudge

WORKERS_MODULE_NUDGES = [MergeHookFailedNudge, UnitBlockedNudge, UnitMergeWaitsNudge, UnitMergedNudge, WorkerWithoutTasksNudge, MergerLineAvailableNudge, WorkerMergedNudge, MergerPassedNudge, *WORKER_NUDGES, *STALE_NUDGES, TestCountUnknownNudge, TestLimitStopNudge, TestLimitRefusalNudge]
