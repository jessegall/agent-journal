from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class ContextCompactedNudge(NudgeDeclaration):
    """The nudge workers.context_compacted."""

    key = "workers.context_compacted"
    type = NudgeType.NOTICE
    text = "Your context passed the limit: it is being compacted"
    turn_limited = False
