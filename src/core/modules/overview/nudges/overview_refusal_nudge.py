from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class OverviewRefusalNudge(NudgeDeclaration):
    """The nudge overview.overview_first."""

    key = "overview.overview_first"
    type = NudgeType.REFUSAL
    text = "Read the overview first"
