from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class AgentInterruptedNudge(NudgeDeclaration):
    """The nudge drivers.interrupted."""

    key = "drivers.interrupted"
    type = NudgeType.STEERING
    text = "You were interrupted: continue your work"
    turn_limited = False
    wakes_agent = True
