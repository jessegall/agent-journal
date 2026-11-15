from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class AliasUnexpandedNudge(NudgeDeclaration):
    """The nudge aliases.unexpanded."""

    key = "aliases.unexpanded"
    type = NudgeType.REFUSAL
    text = "The alias in this line could not be expanded: check its name and arguments"
