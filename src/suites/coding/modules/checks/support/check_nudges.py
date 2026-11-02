from core.base.driver.interval import Interval
from core.base.driver.seconds import Seconds
from core.base.driver.nudge_declaration import NudgeDeclaration
from core.base.driver.nudge_type import NudgeType

CHECK_FAILED = NudgeDeclaration("checks.check_failed", NudgeType.INSTRUCTION, 'check:{check} failed', turn_limited=False)

BROKEN_TASK_WAIT = NudgeDeclaration("checks.broken_task_wait", NudgeType.INSTRUCTION, "task:{task} waits on a command that cannot run: journal task block {task} --until '<command>'", longest_characters=400, interval=Interval(Seconds(1800)), required_command="")
CHECK_NUDGES = [BROKEN_TASK_WAIT, CHECK_FAILED]
