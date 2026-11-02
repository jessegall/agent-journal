from core.base.driver.interval import Interval
from core.base.driver.seconds import Seconds
from core.base.driver.nudge_declaration import NudgeDeclaration
from core.base.driver.nudge_type import NudgeType

WAIT_CHECK = NudgeDeclaration("waits.check_the_wait", NudgeType.INSTRUCTION, 'you have waited {minutes} minutes on wait:{wait}: check it does what you expect', interval=Interval(Seconds(300)))

WAIT_OVER = NudgeDeclaration("waits.wait_over", NudgeType.REMARK, "wait:{wait} is over: {outcome}")
WAIT_NUDGES = [WAIT_CHECK, WAIT_OVER]
