from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class SilentStartFixedNudge(NudgeDeclaration):
    """The nudge processes.silent_start_fixed."""

    key = "processes.silent_start_fixed"
    type = NudgeType.STEERING
    text = "{name} now shows its progress in the chat"
