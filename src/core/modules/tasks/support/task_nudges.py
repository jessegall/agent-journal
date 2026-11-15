from engine.driver.count_down import CountDown
from core.modules.drivers.support.write_span import WriteSpan
from core.modules.tasks.nudges.blocked_tasks_nudge import BlockedTasksNudge
from core.modules.tasks.nudges.current_task_nudge import CurrentTaskNudge
from core.modules.tasks.nudges.task_reopened_nudge import TaskReopenedNudge
from core.modules.tasks.nudges.stop_task_nudge import StopTaskNudge
from core.modules.tasks.nudges.stop_tasks_nudge import StopTasksNudge
from core.modules.tasks.nudges.task_return_reminder_nudge import TaskReturnReminderNudge
from core.modules.tasks.nudges.unlogged_writes_nudge import UnloggedWritesNudge
from core.modules.tasks.nudges.inactive_task_nudge import InactiveTaskNudge
from core.modules.tasks.nudges.missed_log_nudge import MissedLogNudge
from core.modules.tasks.nudges.wait_description_nudge import WaitDescriptionNudge
from core.modules.tasks.nudges.plain_block_nudge import PlainBlockNudge
from core.modules.tasks.nudges.task_name_nudge import TaskNameNudge
from core.modules.tasks.nudges.block_review_nudge import BlockReviewNudge
from core.modules.tasks.nudges.block_review_required_nudge import BlockReviewRequiredNudge
from core.modules.tasks.nudges.user_block_review_nudge import UserBlockReviewNudge
from core.modules.tasks.nudges.task_brief_first_nudge import TaskBriefFirstNudge
from core.modules.tasks.nudges.task_filed_nudge import TaskFiledNudge
from core.modules.tasks.nudges.task_filed_keep_current_nudge import TaskFiledKeepCurrentNudge
from core.modules.tasks.nudges.task_testing_question_nudge import TaskTestingQuestionNudge
from core.modules.tasks.nudges.task_metadata_reminder_nudge import TaskMetadataReminderNudge
from core.modules.tasks.nudges.task_helper_metadata_reminder_nudge import TaskHelperMetadataReminderNudge

LOG_REQUEST_WRITES = 25

LOG_REQUEST = CountDown("tasks.log_request", "log task {task}", WriteSpan(LOG_REQUEST_WRITES))

TASK_NUDGES = [TaskMetadataReminderNudge, TaskHelperMetadataReminderNudge, TaskTestingQuestionNudge, TaskBriefFirstNudge, TaskFiledNudge, TaskFiledKeepCurrentNudge, TaskReopenedNudge, WaitDescriptionNudge, PlainBlockNudge, TaskNameNudge, BlockReviewNudge, BlockReviewRequiredNudge, UserBlockReviewNudge, MissedLogNudge, BlockedTasksNudge, CurrentTaskNudge, LOG_REQUEST.declaration, StopTaskNudge, StopTasksNudge, TaskReturnReminderNudge, UnloggedWritesNudge, InactiveTaskNudge]
