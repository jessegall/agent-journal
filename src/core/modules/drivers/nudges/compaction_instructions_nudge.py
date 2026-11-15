from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class CompactionInstructionsNudge(NudgeDeclaration):
    """The nudge drivers.compaction_instructions."""

    key = "drivers.compaction_instructions"
    type = NudgeType.NOTICE
    text = "{text}"
    turn_limited = False
    full_text = True
