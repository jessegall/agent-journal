from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class MissingModelNudge(NudgeDeclaration):
    """The nudge drivers.missing_model."""

    key = "drivers.missing_model"
    type = NudgeType.REFUSAL
    text = "Name a model in the dispatch: the cheapest one that reliably fits the work"
    turn_limited = False
