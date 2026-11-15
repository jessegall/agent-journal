from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class NativeSubagentWithoutLaunchNudge(NudgeDeclaration):
    """The nudge drivers.native_subagent_no_launch."""

    key = "drivers.native_subagent_no_launch"
    type = NudgeType.SAFETY_REFUSAL
    text = "No helper launch is running: do this work yourself"
