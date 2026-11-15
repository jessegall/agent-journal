from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class MainHelperBanNudge(NudgeDeclaration):
    """The nudge coding.main_starts_no_helpers."""

    key = "coding.main_starts_no_helpers"
    type = NudgeType.REFUSAL
    text = "The main agent starts no read-only helpers here: {then}"
