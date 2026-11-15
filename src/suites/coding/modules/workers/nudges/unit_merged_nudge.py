from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class UnitMergedNudge(NudgeDeclaration):
    """The nudge workers.unit_merged."""

    key = "workers.unit_merged"
    type = NudgeType.STEERING
    text = "worker:{worker} merged {count} tasks; its note is in merge-ask:{merge_ask}"
    wakes_agent = True
