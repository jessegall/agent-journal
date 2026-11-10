from engine.driver.nudge_declaration import NudgeDeclaration
from engine.driver.nudge_type import NudgeType

PARENT_REPORT_SOURCE = "agents.report"
REPORT_FIELD = "last_assistant_message"
EMPTY_REPORT_TEXT = "It ended without a report."
PARENT_REPORT = NudgeDeclaration("agents.report", NudgeType.STEERING, "agent:{agent} reports in message:{message}", turn_limited=False, wakes_agent=True)
REPORT_NUDGES = [PARENT_REPORT]
