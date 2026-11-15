from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class PlanFinishedNudge(NudgeDeclaration):
    """The nudge plans.plan_finished."""

    key = "plans.plan_finished"
    type = NudgeType.STEERING
    text = "Plan {plan} done: run the full suite; merging to main and releasing wait for the user's go-ahead"
    turn_limited = False
