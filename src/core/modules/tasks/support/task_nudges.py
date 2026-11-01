from core.base.driver.nudge_declaration import NudgeDeclaration
from core.base.driver.nudge_type import NudgeType

BACK_TO_TASK = NudgeDeclaration("tasks.back_to_task", NudgeType.REMARK, 'back to {name}', once_per_turn=False)
BLOCKED_TASKS = NudgeDeclaration("tasks.blocked_tasks", NudgeType.REFUSAL, 'blocked tasks: {tasks}: unblock what can go on with journal task unblock <n>, or stop again to leave them')
TASK_IN_HAND = NudgeDeclaration("tasks.task_in_hand", NudgeType.REMARK, '{name}, is in hand; {logged}', once_per_turn=False)
LOG_REQUEST = NudgeDeclaration("tasks.log_request", NudgeType.INSTRUCTION, '{writes} writes since you logged {name}: log where it stands with journal task log {task} "<where it stands>"', once_per_turn=False)
TASK_AT_STOP = NudgeDeclaration("tasks.task_at_stop", NudgeType.REFUSAL, '{name}, is in hand: carry on, or block it with journal task block {task} --reason "<why>"')
UNLOGGED_WRITES = NudgeDeclaration("tasks.unlogged_writes", NudgeType.REFUSAL, '{writes} writes since you logged {name}: writes wait for journal task log {task} "<what was done>"')
INACTIVE_TASK = NudgeDeclaration("tasks.inactive_task", NudgeType.INSTRUCTION, 'nothing has happened for {minutes} minutes: carry on with {name}, or log why it waits', once_per_turn=False)

MISSED_LOG = NudgeDeclaration("tasks.missed_log", NudgeType.REMARK, 'log what the summary missed: journal task log {task} "<what>"')
TASK_NUDGES = [MISSED_LOG, BACK_TO_TASK, BLOCKED_TASKS, TASK_IN_HAND, LOG_REQUEST, TASK_AT_STOP, UNLOGGED_WRITES, INACTIVE_TASK]
