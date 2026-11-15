from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class HelperLimitWarningNudge(NudgeDeclaration):
    """The nudge helpers.limit_warning."""

    key = "helpers.limit_warning"
    type = NudgeType.STEERING
    text = "agent:{agent} is near its {limit} limit: stop it, or let it run out"
    turn_limited = False
