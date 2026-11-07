from core.base.driver.interval import Interval
from core.base.driver.seconds import Seconds
from core.base.driver.nudge_declaration import NudgeDeclaration
from core.base.driver.nudge_type import NudgeType

CHECK_FAILED = NudgeDeclaration("checks.check_failed", NudgeType.NOTICE, 'check:{check} failed', turn_limited=False)

BROKEN_TASK_WAIT = NudgeDeclaration("checks.broken_task_wait", NudgeType.STEERING, "task:{task} waits on a command that cannot run: journal task block {task} --until '<command>'", interval=Interval(Seconds(1800)))
CHECK_NUDGES = [BROKEN_TASK_WAIT, CHECK_FAILED]
