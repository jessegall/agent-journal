from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class PlanApprovedWithMessageNudge(NudgeDeclaration):
    """The nudge plans.plan_approved_message."""

    key = "plans.plan_approved_message"
    type = NudgeType.NOTICE
    text = "Plan {plan} approved with a message: read message {message} before starting"
    turn_limited = False
