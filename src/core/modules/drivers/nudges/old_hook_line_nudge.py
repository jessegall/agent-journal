from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class OldHookLineNudge(NudgeDeclaration):
    """The nudge drivers.old_hook_line."""

    key = "drivers.old_hook_line"
    type = NudgeType.SAFETY_REFUSAL
    text = "Your hooks are too old to judge this line: update the journal, then restart the agent"
