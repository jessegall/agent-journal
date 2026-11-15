from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class PlanBlockedNudge(NudgeDeclaration):
    """The nudge plans.plan_blocked."""

    key = "plans.plan_blocked"
    type = NudgeType.NOTICE
    text = "plan:{plan} is blocked"
    turn_limited = False
