from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class PlanWaitingNudge(NudgeDeclaration):
    """The nudge plans.plan_waiting."""

    key = "plans.plan_waiting"
    type = NudgeType.NOTICE
    text = "Plan {plan} is ready: a user approves it on its plan card"
    turn_limited = False
