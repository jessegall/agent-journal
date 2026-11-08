from core.base.driver.nudge_declaration import NudgeDeclaration
from core.base.driver.nudge_type import NudgeType

AGENT_START_FAILED = NudgeDeclaration("agents.start_failed", NudgeType.STEERING, "agent:{agent} could not start", wakes_agent=True)
