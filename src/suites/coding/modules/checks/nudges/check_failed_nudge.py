from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class CheckFailedNudge(NudgeDeclaration):
    """The nudge checks.check_failed."""

    key = "checks.check_failed"
    type = NudgeType.NOTICE
    text = 'check:{check} failed'
    turn_limited = False
