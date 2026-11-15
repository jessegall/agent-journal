from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class SavedCommandUnknownNudge(NudgeDeclaration):
    """The nudge aliases.saved_command_unknown."""

    key = "aliases.saved_command_unknown"
    type = NudgeType.REFUSAL
    text = "Save this command as an alias of category {category}, then run the alias"
