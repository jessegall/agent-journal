from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class PausedRefusalNudge(NudgeDeclaration):
    """The nudge drivers.paused."""

    key = "drivers.paused"
    type = NudgeType.REFUSAL
    text = "The user paused you: only journal commands and reads run until you are resumed; reply in the chat"
    turn_limited = False
