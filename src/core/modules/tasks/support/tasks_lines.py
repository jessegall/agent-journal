from core.modules.tasks.lines.block_review_lines import BlockReviewLines
from core.modules.tasks.lines.blocked_work_lines import BlockedWorkLines
from core.modules.tasks.lines.log_request_lines import LogRequestLines
from core.modules.tasks.lines.pending_block_lines import PendingBlockLines
from core.modules.tasks.lines.session_start_summary_lines import SessionStartSummaryLines
from core.modules.tasks.lines.single_started_task_lines import SingleStartedTaskLines
from core.modules.tasks.lines.stalled_task_lines import StalledTaskLines
from core.modules.tasks.lines.task_filed_lines import TaskFiledLines
from core.modules.tasks.lines.task_name_lines import TaskNameLines
from core.modules.tasks.lines.wait_text_lines import WaitTextLines

TASKS_LINES = [BlockedWorkLines, StalledTaskLines, LogRequestLines, TaskFiledLines, TaskNameLines, PendingBlockLines, SingleStartedTaskLines, SessionStartSummaryLines, WaitTextLines, BlockReviewLines]
