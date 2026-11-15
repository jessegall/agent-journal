from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class UnitBlockedNudge(NudgeDeclaration):
    """The nudge workers.unit_blocked."""

    key = "workers.unit_blocked"
    type = NudgeType.STEERING
    text = "worker:{worker} committed {committed}; every task left in its unit is blocked: {waits}"
    wakes_agent = True
