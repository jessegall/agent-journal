from core.base.driver.interval import Interval
from core.base.driver.seconds import Seconds
from core.base.driver.nudge_declaration import NudgeDeclaration
from core.base.driver.nudge_type import NudgeType

WAIT_CHECK = NudgeDeclaration("waits.check_the_wait", NudgeType.STEERING, 'you have waited {minutes} minutes on wait:{wait}: check it does what you expect', interval=Interval(Seconds(300)))

WAIT_ENDED = NudgeDeclaration("waits.wait_over", NudgeType.STEERING, "wait:{wait} is over: journal wait show {wait}", plural_text="waits {wait} are over: read each with journal wait show <id>", id_field="wait")
WAIT_NUDGES = [WAIT_CHECK, WAIT_ENDED]
