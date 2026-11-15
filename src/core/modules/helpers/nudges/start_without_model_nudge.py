from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class StartWithoutModelNudge(NudgeDeclaration):
    """The nudge helpers.start_without_model."""

    key = "helpers.start_without_model"
    type = NudgeType.REFUSAL
    text = "Name a model when starting a helper, or default for the profile's own"
