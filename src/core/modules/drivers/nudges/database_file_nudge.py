from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class DatabaseFileNudge(NudgeDeclaration):
    """The nudge drivers.database_file."""

    key = "drivers.database_file"
    type = NudgeType.SAFETY_REFUSAL
    text = "The journal's database file is changed only by the journal's commands: find the command for what you want with journal --help, or say in your report what is missing"
    full_text = True
