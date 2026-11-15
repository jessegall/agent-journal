from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class EscalationAnsweredNudge(NudgeDeclaration):
    """The nudge drivers.escalation-answered, which wakes the agent whose escalation its responder answered."""

    key = "drivers.escalation-answered"
    type = NudgeType.STEERING
    text = "Your escalation was answered, so go on as it says: journal escalation show {escalation}"
    turn_limited = False
    wakes_agent = True
