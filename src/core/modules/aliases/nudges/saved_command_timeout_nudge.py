from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class SavedCommandTimeoutNudge(NudgeDeclaration):
    """The nudge aliases.saved_command_timeout."""

    key = "aliases.saved_command_timeout"
    type = NudgeType.REFUSAL
    text = "Invalid --timeout: use seconds, or 30s, 5m, 2h or 1d"
