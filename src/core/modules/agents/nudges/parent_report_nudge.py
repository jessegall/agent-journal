from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class ParentReportNudge(NudgeDeclaration):
    """The nudge agents.report."""

    key = "agents.report"
    type = NudgeType.STEERING
    text = "agent:{agent} reported in message:{message}: read it and act on it"
    turn_limited = False
    wakes_agent = True
