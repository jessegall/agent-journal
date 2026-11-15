from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class DatabaseFileNudge(NudgeDeclaration):
    """The nudge drivers.database_file."""

    key = "drivers.database_file"
    type = NudgeType.SAFETY_REFUSAL
    text = "The journal's database changes only through journal commands: find yours with journal --help, or report what is missing"
    full_text = True
