from core.base.driver.nudge_declaration import NudgeDeclaration
from core.base.driver.nudge_type import NudgeType

CHECK_FAILED = NudgeDeclaration("checks.check_failed", NudgeType.INSTRUCTION, '{text}', once_per_turn=False)

BROKEN_TASK_WAIT = NudgeDeclaration("checks.broken_task_wait", NudgeType.INSTRUCTION, "task {task} waits on a command that cannot run: {output}: fix it with journal task block {task} --until '<command>', or journal task unblock {task}", longest_characters=400, repeat_seconds=1800)
CHECK_NUDGES = [BROKEN_TASK_WAIT, CHECK_FAILED]
