from core.base.driver.interval import Interval
from core.base.driver.seconds import Seconds
from core.base.driver.nudge_declaration import NudgeDeclaration
from core.base.driver.nudge_type import NudgeType

CHECK_FAILED = NudgeDeclaration("checks.check_failed", NudgeType.INSTRUCTION, '{text}', turn_limited=False)

BROKEN_TASK_WAIT = NudgeDeclaration("checks.broken_task_wait", NudgeType.INSTRUCTION, "task {task} waits on a command that cannot run: {output}: fix it with journal task block {task} --until '<command>', or journal task unblock {task}", longest_characters=400, interval=Interval(Seconds(1800)), pays="")
CHECK_NUDGES = [BROKEN_TASK_WAIT, CHECK_FAILED]
