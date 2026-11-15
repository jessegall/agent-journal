from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class CommandTypeUnknownNudge(NudgeDeclaration):
    """The nudge aliases.command_type_unknown."""

    key = "aliases.command_type_unknown"
    type = NudgeType.REFUSAL
    text = "{program} has an unknown command type: {hint}"
