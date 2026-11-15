from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class SavedCommandMixedNudge(NudgeDeclaration):
    """The nudge aliases.saved_command_mixed."""

    key = "aliases.saved_command_mixed"
    type = NudgeType.REFUSAL
    text = "Run a test or build on its own line, separate from other commands"
