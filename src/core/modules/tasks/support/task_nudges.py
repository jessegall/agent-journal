from core.base.driver.nudge_declaration import NudgeDeclaration
from core.base.driver.nudge_type import NudgeType

TASK_RETURN = NudgeDeclaration("tasks.back_to_task", NudgeType.REMARK, 'back to {name}', turn_limited=False)
BLOCKED_TASKS = NudgeDeclaration("tasks.blocked_tasks", NudgeType.REFUSAL, 'blocked tasks: {tasks}: unblock what can go on with journal task unblock <n>, or stop again to leave them')
CURRENT_TASK = NudgeDeclaration("tasks.task_in_hand", NudgeType.REMARK, '{name}, is in hand; {logged}', turn_limited=False)
LOG_REQUEST = NudgeDeclaration("tasks.log_request", NudgeType.INSTRUCTION, '{writes} writes since you logged {name}: log where it stands with journal task log {task} "<where it stands>"', turn_limited=False)
STOP_TASK = NudgeDeclaration("tasks.task_at_stop", NudgeType.REFUSAL, '{name}, is in hand: carry on, or block it with journal task block {task} --reason "<why>"')
UNLOGGED_WRITES = NudgeDeclaration("tasks.unlogged_writes", NudgeType.REFUSAL, '{writes} writes since you logged {name}: writes wait for journal task log {task} "<what was done>"')
INACTIVE_TASK = NudgeDeclaration("tasks.inactive_task", NudgeType.INSTRUCTION, 'nothing has happened for {minutes} minutes: carry on with {name}, or log why it waits', turn_limited=False)

MISSED_LOG = NudgeDeclaration("tasks.missed_log", NudgeType.REMARK, 'log what the summary missed: journal task log {task} "<what>"')
WAIT_DESCRIPTION = NudgeDeclaration("tasks.wait_in_words", NudgeType.INSTRUCTION, "a wait is a block the journal can see, not words: journal task block <n> --on task:<m> opens by itself when that task ends, --until '<command>' opens when the command passes", repeat_seconds=1800)
TASK_NAME = NudgeDeclaration("tasks.named_task", NudgeType.REMARK, "task {task} names open task {other}; if it waits on it: journal task block {task} --on task:{other}", turn_limited=False)
UNOPENABLE_BLOCKS = NudgeDeclaration("tasks.unopenable_blocks", NudgeType.REMARK, "blocked with nothing to open them: {tasks}: give each --on or --until with journal task block, or journal task unblock <n> once what it waits on has arrived", repeat_seconds=2700)
TASK_NUDGES = [WAIT_DESCRIPTION, TASK_NAME, UNOPENABLE_BLOCKS, MISSED_LOG, TASK_RETURN, BLOCKED_TASKS, CURRENT_TASK, LOG_REQUEST, STOP_TASK, UNLOGGED_WRITES, INACTIVE_TASK]
