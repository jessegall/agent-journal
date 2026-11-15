from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class AgentResumedNudge(NudgeDeclaration):
    """The nudge drivers.resumed."""

    key = "drivers.resumed"
    type = NudgeType.STEERING
    text = "The user resumed you: continue where you stopped"
