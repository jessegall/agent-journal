from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class AliasMissingNudge(NudgeDeclaration):
    """The nudge aliases.missing."""

    key = "aliases.missing"
    type = NudgeType.REFUSAL
    text = "This line uses an alias that no longer exists: use the plain command or another alias"
