from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType

AGENT_START_FAILED = NudgeDeclaration("agents.start_failed", NudgeType.STEERING, "agent:{agent} failed to start: check its error, then retry or report it", wakes_agent=True)
