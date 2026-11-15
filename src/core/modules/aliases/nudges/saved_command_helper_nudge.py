from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class SavedCommandHelperNudge(NudgeDeclaration):
    """The nudge aliases.saved_command_helper."""

    key = "aliases.saved_command_helper"
    type = NudgeType.REFUSAL
    text = "Read-only helpers only read: ask your parent to save an alias for this {category}"
