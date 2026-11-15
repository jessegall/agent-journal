from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class SavedCommandSilentNudge(NudgeDeclaration):
    """The nudge aliases.saved_command_silent."""

    key = "aliases.saved_command_silent"
    type = NudgeType.REFUSAL
    text = "Alias {name} printed nothing for 30s on its last run: make it print each step, then rerun it"
