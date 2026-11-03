from core.base.driver.count_down import CountDown
from core.base.driver.interval import Interval
from core.base.driver.seconds import Seconds
from core.base.driver.nudge_declaration import NudgeDeclaration
from core.base.driver.nudge_type import NudgeType
from core.modules.drivers.support.write_span import WriteSpan
from core.modules.tasks.support.closed_tasks import ClosedTasks

LOG_REQUEST_WRITES = 25

TASK_RETURN = NudgeDeclaration("tasks.back_to_task", NudgeType.STEERING, 'back to task:{task}', turn_limited=False)
BLOCKED_TASKS = NudgeDeclaration("tasks.blocked_tasks", NudgeType.REFUSAL, 'blocked tasks: {tasks}: unblock what can go on with journal task unblock <n>, or stop again to leave them')
CURRENT_TASK = NudgeDeclaration("tasks.task_in_hand", NudgeType.STEERING, 'task:{task} is in hand', turn_limited=False)
TASK_REOPENED = NudgeDeclaration("tasks.open_again", NudgeType.STEERING, "task:{task} is open again: what it waited on has ended")
LOG_REQUEST = CountDown("tasks.log_request", "log task {task}", WriteSpan(LOG_REQUEST_WRITES))
STOP_TASK = NudgeDeclaration("tasks.task_at_stop", NudgeType.REFUSAL, 'task:{task} is in hand: carry on, or journal task block {task} --reason "<why>"')
STOP_TASKS = NudgeDeclaration("tasks.tasks_at_stop", NudgeType.REFUSAL, 'in hand: {tasks}: carry on, or close, release or block each')
TASK_RETURN_REMINDER = NudgeDeclaration("tasks.task_still_held", NudgeType.STEERING, 'back to task:{task}: carry on, close it, or release it', turn_limited=False)
UNLOGGED_WRITES = NudgeDeclaration("tasks.unlogged_writes", NudgeType.REFUSAL, 'log task {task} due: 0 writes: journal task log {task} "<what was done>"')
INACTIVE_TASK = NudgeDeclaration("tasks.inactive_task", NudgeType.STEERING, 'nothing has happened for {minutes} minutes: carry on with task:{task}, or log why it waits', turn_limited=False)

MISSED_LOG = NudgeDeclaration("tasks.missed_log", NudgeType.STEERING, 'log what the summary missed: journal task log {task} "<what>"')
WAIT_DESCRIPTION = NudgeDeclaration("tasks.wait_in_words", NudgeType.STEERING, "a wait is a block: journal task block <n> --on task:<m>, or --until '<command>'", interval=Interval(Seconds(1800)), required_command="")
TASK_NAME = NudgeDeclaration("tasks.named_task", NudgeType.STEERING, "task {task} names open task {other}; if it waits on it: journal task block {task} --on task:{other}", turn_limited=False)
UNOPENABLE_BLOCKS = NudgeDeclaration("tasks.unopenable_blocks", NudgeType.STEERING, 'blocked with nothing to open them: {tasks}: give each --on or --until, or unblock it', interval=Interval(Seconds(2700), ClosedTasks(5)), turn_limited=False)
TASK_BRIEF_FIRST = NudgeDeclaration("tasks.brief_first", NudgeType.REFUSAL, "read task {task} first: journal task brief {task}")
TASK_FILED = NudgeDeclaration("tasks.filed", NudgeType.STEERING, "filed: leave it open, do not start it", turn_limited=False)
TASK_FILED_KEEP_CURRENT = NudgeDeclaration("tasks.filed_keep_current", NudgeType.STEERING, "filed: carry on with task:{task}, and leave the new one open", turn_limited=False)
TESTING_TASKS_FULL_RUN = NudgeDeclaration("tasks.testing_tasks_full_run", NudgeType.INFO, '{tasks} wait in testing: this full test run closes them if it passes', turn_limited=False)
TESTING_TASKS_FAILED_RUN = NudgeDeclaration("tasks.testing_tasks_failed_run", NudgeType.INFO, 'the full test run failed: {tasks} stay in testing', turn_limited=False)
TASK_TESTING_QUESTION = NudgeDeclaration("tasks.testing_question", NudgeType.STEERING, "did you mean to move task:{task} to testing first? journal task test {task}", turn_limited=False)
TASK_NUDGES = [TASK_TESTING_QUESTION, TASK_BRIEF_FIRST, TESTING_TASKS_FULL_RUN, TESTING_TASKS_FAILED_RUN, TASK_FILED, TASK_FILED_KEEP_CURRENT, TASK_REOPENED, WAIT_DESCRIPTION, TASK_NAME, UNOPENABLE_BLOCKS, MISSED_LOG, TASK_RETURN, BLOCKED_TASKS, CURRENT_TASK, LOG_REQUEST.declaration, STOP_TASK, STOP_TASKS, TASK_RETURN_REMINDER, UNLOGGED_WRITES, INACTIVE_TASK]
