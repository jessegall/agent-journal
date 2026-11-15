from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class IgnoredWakeNudge(NudgeDeclaration):
    """The nudge drivers.ignored-wake, told once to the parent of an agent that took no turn after its wakes."""

    key = "drivers.ignored-wake"
    type = NudgeType.NOTICE
    text = "agent {agent} took no turn after {count} wakes: journal agent-wake list --agent {agent}"
