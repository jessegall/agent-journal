from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class UnitMergeWaitsNudge(NudgeDeclaration):
    """The nudge workers.unit_merge_waits."""

    key = "workers.unit_merge_waits"
    type = NudgeType.STEERING
    text = "worker:{worker} waits for its unit merge in merge-ask:{merge_ask}; the merger is off"
    wakes_agent = True
