from engine.driver.interval import Interval
from engine.driver.seconds import Seconds
from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType

CHECK_FAILED = NudgeDeclaration("checks.check_failed", NudgeType.NOTICE, 'check:{check} failed', turn_limited=False)

BROKEN_TASK_WAIT = NudgeDeclaration("checks.broken_task_wait", NudgeType.STEERING, "task:{task} waits on a command that cannot run: fix or change the wait", interval=Interval(Seconds(1800)))
CHECK_NUDGES = [BROKEN_TASK_WAIT, CHECK_FAILED]
