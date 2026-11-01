from core.base.driver.nudge_declaration import NudgeDeclaration
from core.base.driver.nudge_type import NudgeType

WAIT_CHECK = NudgeDeclaration("waits.check_the_wait", NudgeType.INSTRUCTION, "you have waited {minutes} minutes on {focus}: read its latest lines and check it does what you expect", repeat_seconds=300)

WAIT_NUDGES = [WAIT_CHECK]
