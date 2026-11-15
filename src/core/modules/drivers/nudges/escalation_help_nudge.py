from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class EscalationHelpNudge(NudgeDeclaration):
    """The nudge drivers.escalation-help, which wakes the parent an agent asked for help."""

    key = "drivers.escalation-help"
    type = NudgeType.STEERING
    text = "Agent {agent} asks for your help after {count} refusals in a row: journal escalation show {escalation}"
    turn_limited = False
    wakes_agent = True
