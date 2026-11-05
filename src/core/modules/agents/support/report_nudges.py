from core.base.driver.nudge_declaration import NudgeDeclaration
from core.base.driver.nudge_type import NudgeType

PARENT_REPORT_SOURCE = "agents.report"
REPORT_FIELD = "last_assistant_message"
EMPTY_REPORT_TEXT = "It ended without a report."
SHORT_REPORT_CHARACTERS = 2000
PARENT_REPORT = NudgeDeclaration("agents.report", NudgeType.STEERING, "agent:{agent} reports in message:{message}: journal message read {message}", turn_limited=False, wakes_agent=True)
PARENT_SHORT_REPORT = NudgeDeclaration("agents.short_report", NudgeType.STEERING, "agent:{agent} reports in message:{message}: {report}", turn_limited=False, wakes_agent=True)
REPORT_NUDGES = [PARENT_REPORT, PARENT_SHORT_REPORT]
