from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class AgentCompactedNudge(NudgeDeclaration):
    """The nudge drivers.compacted."""

    key = "drivers.compacted"
    type = NudgeType.STEERING
    text = "Your context was compacted: read the overview, then continue your work"
    turn_limited = False
    wakes_agent = True
