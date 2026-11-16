from suites.coding.modules.workers.lines.context.cache_refresh_lines import CacheRefreshLines
from suites.coding.modules.workers.lines.context.compaction_request_lines import CompactionRequestLines
from suites.coding.modules.workers.lines.context.context_stop_now_lines import ContextStopNowLines
from suites.coding.modules.workers.lines.inactive_helper_lines import InactiveHelperLines
from suites.coding.modules.workers.lines.inactive_worker_stop_lines import InactiveWorkerStopLines
from suites.coding.modules.workers.lines.merge_checkout_lines import MergeCheckoutLines
from suites.coding.modules.workers.lines.phase_test_lines import PhaseTestLines
from suites.coding.modules.workers.lines.small_batch_lines import SmallBatchLines
from suites.coding.modules.workers.lines.stopped_worker_lines import StoppedWorkerLines
from suites.coding.modules.workers.lines.unmerged_worker_lines import UnmergedWorkerLines
from suites.coding.modules.workers.lines.unstarted_worker_lines import UnstartedWorkerLines
from suites.coding.modules.workers.lines.worker_blocked_task_lines import WorkerBlockedTaskLines
from suites.coding.modules.workers.lines.worker_log_due_lines import WorkerLogDueLines
from suites.coding.modules.workers.lines.workers_out_lines import WorkersOutLines

WORKERS_LINES = [InactiveWorkerStopLines, CacheRefreshLines, WorkerBlockedTaskLines, CompactionRequestLines, ContextStopNowLines, InactiveHelperLines, MergeCheckoutLines, PhaseTestLines, SmallBatchLines, StoppedWorkerLines, UnmergedWorkerLines, UnstartedWorkerLines, WorkerLogDueLines, WorkersOutLines]
