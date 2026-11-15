from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class MemoryLineNudge(NudgeDeclaration):
    """The nudge memories.memory_line."""

    key = "memories.memory_line"
    type = NudgeType.STEERING
    text = "memory:{memory} applies now: follow it"
    turn_limited = False
