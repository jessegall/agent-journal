from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class SilentStartTaughtNudge(NudgeDeclaration):
    """The nudge processes.silent_start_taught."""

    key = "processes.silent_start_taught"
    type = NudgeType.NOTICE
    text = "{name} ran {seconds}s with no percent in the chat. Its output has line shape {shape}, and it {hint}. Add or adjust a reader now: it applies to a running output at once, so do not wait for it to end."
