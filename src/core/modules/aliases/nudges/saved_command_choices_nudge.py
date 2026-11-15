from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class SavedCommandChoicesNudge(NudgeDeclaration):
    """The nudge aliases.saved_command_choices."""

    key = "aliases.saved_command_choices"
    type = NudgeType.REFUSAL
    text = "Run this through a saved {category} alias, with --tail, --head or --cut"
