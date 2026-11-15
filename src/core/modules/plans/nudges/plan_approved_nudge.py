from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class PlanApprovedNudge(NudgeDeclaration):
    """The nudge plans.plan_approved."""

    key = "plans.plan_approved"
    type = NudgeType.NOTICE
    text = "Plan {plan} approved"
    turn_limited = False
