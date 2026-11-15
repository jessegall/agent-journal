from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class PlanStalledNudge(NudgeDeclaration):
    """The nudge plans.plan_stalled."""

    key = "plans.plan_stalled"
    type = NudgeType.NOTICE
    text = "plan {plan}: no task can start; {count} are waiting or blocked{waits}"
    turn_limited = False
