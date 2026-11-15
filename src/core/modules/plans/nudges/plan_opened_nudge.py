from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class PlanOpenedNudge(NudgeDeclaration):
    """The nudge plans.plan_opened."""

    key = "plans.plan_opened"
    type = NudgeType.STEERING
    text = "plan:{plan} is open again: the plans it waited on have ended"
    turn_limited = False
