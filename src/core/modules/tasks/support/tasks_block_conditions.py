from core.modules.tasks.support.block_conditions.started_task_exists import StartedTaskExists
from core.modules.tasks.support.block_conditions.task_blocks_reviewed import TaskBlocksReviewed
from core.modules.tasks.support.block_conditions.task_brief_read import TaskBriefRead
from core.modules.tasks.support.block_conditions.task_closed import TaskClosed
from core.modules.tasks.support.block_conditions.task_logged import TaskLogged
from core.modules.tasks.support.block_conditions.task_started import TaskStarted
from core.modules.tasks.support.block_conditions.task_stopped import TaskStopped

TASKS_BLOCK_CONDITIONS = [TaskStopped, TaskStarted, TaskClosed, StartedTaskExists, TaskLogged, TaskBriefRead, TaskBlocksReviewed]
