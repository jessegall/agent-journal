from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class OverviewLineNudge(NudgeDeclaration):
    """The nudge overview.run_overview."""

    key = "overview.run_overview"
    type = NudgeType.STEERING
    text = "Read the overview"
    turn_limited = False
