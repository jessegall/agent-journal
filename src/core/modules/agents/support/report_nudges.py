from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType

PARENT_REPORT_SOURCE = "agents.report"
REPORT_FIELD = "last_assistant_message"
EMPTY_REPORT_TEXT = "It ended without a report."
PARENT_REPORT = NudgeDeclaration("agents.report", NudgeType.STEERING, "agent:{agent} reported in message:{message}: read it and act on it", turn_limited=False, wakes_agent=True)
REPORT_NUDGES = [PARENT_REPORT]
