from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class PlanCancelledNudge(NudgeDeclaration):
    """The nudge plans.plan_cancelled."""

    key = "plans.plan_cancelled"
    type = NudgeType.NOTICE
    text = "plan:{plan} is cancelled"
    turn_limited = False
