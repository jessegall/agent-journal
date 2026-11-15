from engine.driver.count_down import CountDown
from core.modules.drivers.support.write_span import WriteSpan
from core.modules.tasks.nudges.blocked_tasks_message import BlockedTasksMessage
from core.modules.tasks.nudges.current_task_message import CurrentTaskMessage
from core.modules.tasks.nudges.task_reopened_message import TaskReopenedMessage
from core.modules.tasks.nudges.stop_task_message import StopTaskMessage
from core.modules.tasks.nudges.stop_tasks_message import StopTasksMessage
from core.modules.tasks.nudges.task_return_reminder_message import TaskReturnReminderMessage
from core.modules.tasks.nudges.unlogged_writes_message import UnloggedWritesMessage
from core.modules.tasks.nudges.inactive_task_message import InactiveTaskMessage
from core.modules.tasks.nudges.missed_log_message import MissedLogMessage
from core.modules.tasks.nudges.wait_description_message import WaitDescriptionMessage
from core.modules.tasks.nudges.plain_block_message import PlainBlockMessage
from core.modules.tasks.nudges.task_name_message import TaskNameMessage
from core.modules.tasks.nudges.block_review_message import BlockReviewMessage
from core.modules.tasks.nudges.block_review_required_message import BlockReviewRequiredMessage
from core.modules.tasks.nudges.user_block_review_message import UserBlockReviewMessage
from core.modules.tasks.nudges.task_brief_first_message import TaskBriefFirstMessage
from core.modules.tasks.nudges.task_filed_message import TaskFiledMessage
from core.modules.tasks.nudges.task_filed_keep_current_message import TaskFiledKeepCurrentMessage
from core.modules.tasks.nudges.task_testing_question_message import TaskTestingQuestionMessage
from core.modules.tasks.nudges.task_metadata_reminder_message import TaskMetadataReminderMessage
from core.modules.tasks.nudges.task_helper_metadata_reminder_message import TaskHelperMetadataReminderMessage

LOG_REQUEST_WRITES = 25

LOG_REQUEST = CountDown("tasks.log_request", "log task {task}", WriteSpan(LOG_REQUEST_WRITES))

TASK_NUDGES = [TaskMetadataReminderMessage, TaskHelperMetadataReminderMessage, TaskTestingQuestionMessage, TaskBriefFirstMessage, TaskFiledMessage, TaskFiledKeepCurrentMessage, TaskReopenedMessage, WaitDescriptionMessage, PlainBlockMessage, TaskNameMessage, BlockReviewMessage, BlockReviewRequiredMessage, UserBlockReviewMessage, MissedLogMessage, BlockedTasksMessage, CurrentTaskMessage, LOG_REQUEST.declaration, StopTaskMessage, StopTasksMessage, TaskReturnReminderMessage, UnloggedWritesMessage, InactiveTaskMessage]
