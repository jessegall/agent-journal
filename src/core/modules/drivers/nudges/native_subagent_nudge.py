from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class NativeSubagentNudge(NudgeDeclaration):
    """The nudge drivers.native_subagent."""

    key = "drivers.native_subagent"
    type = NudgeType.SAFETY_REFUSAL
    text = "Start a helper for this, with a profile and a brief"
