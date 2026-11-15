from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class HelperTypeCategoryNudge(NudgeDeclaration):
    """The nudge drivers.helper_type_category."""

    key = "drivers.helper_type_category"
    type = NudgeType.REFUSAL
    text = "a {helper_type} here runs no {category} command{hint}"
    full_text = True
