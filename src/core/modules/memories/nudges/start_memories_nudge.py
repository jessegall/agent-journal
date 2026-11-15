from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class StartMemoriesNudge(NudgeDeclaration):
    """The nudge memories.start_memories."""

    key = "memories.start_memories"
    type = NudgeType.STEERING
    text = '{count} memories to read: load the memory skill as directed, then list them'
    turn_limited = False
    required_command = "journal memory list"
