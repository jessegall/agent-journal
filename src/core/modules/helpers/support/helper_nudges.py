from core.base.driver.nudge_declaration import NudgeDeclaration
from core.base.driver.nudge_type import NudgeType

HELPER_UNSTARTED = NudgeDeclaration("helpers.unstarted", NudgeType.STEERING, "agent:{agent} made no call in 60 seconds: journal agent terminal {agent}", turn_limited=False)
HELPER_NUDGES = [HELPER_UNSTARTED]
