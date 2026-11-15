from core.modules.agents.nudges.parent_report_nudge import ParentReportNudge

PARENT_REPORT_SOURCE = "agents.report"
REPORT_FIELD = "last_assistant_message"
EMPTY_REPORT_TEXT = "It ended without a report."
REPORT_NUDGES = [ParentReportNudge]
