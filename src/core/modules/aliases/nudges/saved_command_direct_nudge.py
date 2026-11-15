from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class SavedCommandDirectNudge(NudgeDeclaration):
    """The nudge aliases.saved_command_direct."""

    key = "aliases.saved_command_direct"
    type = NudgeType.REFUSAL
    text = "This is a saved command: run journal {name} --tail 20"
