from core.base.driver.nudge_declaration import NudgeDeclaration
from core.base.driver.nudge_type import NudgeType

EXCEPTION_LINE = NudgeDeclaration("developer.exception", NudgeType.STEERING, "the journal failed in {place}: {message}", turn_limited=False, wakes_agent=True)
DEVELOPER_NUDGES = [EXCEPTION_LINE]
