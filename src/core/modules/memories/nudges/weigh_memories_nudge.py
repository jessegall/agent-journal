from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class WeighMemoriesNudge(NudgeDeclaration):
    """The nudge memories.weigh_memories."""

    key = "memories.weigh_memories"
    type = NudgeType.NOTICE
    text = "Context at {percent}%: weigh your {count} memories within {uses} tool uses, heaviest first: {memories}. Compaction loses nothing you keep: carry on"
    turn_limited = False
