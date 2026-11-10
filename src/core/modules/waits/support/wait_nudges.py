from engine.driver.interval import Interval
from engine.driver.seconds import Seconds
from engine.driver.nudge_declaration import NudgeDeclaration
from engine.driver.nudge_type import NudgeType

WAIT_CHECK = NudgeDeclaration("waits.check_the_wait", NudgeType.STEERING, 'you have waited {minutes} minutes on wait:{wait}: check it does what you expect', interval=Interval(Seconds(300)))

WAIT_ENDED = NudgeDeclaration("waits.wait_over", NudgeType.STEERING, "wait:{wait} is over", plural_text="waits {wait} are over", id_field="wait", turn_limited=False, wakes_agent=True)
WAIT_NUDGES = [WAIT_CHECK, WAIT_ENDED]
