from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class SkipsSpentNudge(NudgeDeclaration):
    """The nudge drivers.skips_spent."""

    key = "drivers.skips_spent"
    type = NudgeType.STEERING
    text = "agent:{agent} skipped {count} refusals in a row and lost the right to skip"
    turn_limited = False
    wakes_agent = True
