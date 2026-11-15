from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class PlanContextNudge(NudgeDeclaration):
    """The nudge plans.start_context."""

    key = "plans.start_context"
    type = NudgeType.STEERING
    text = "Plan {plan} started: read its context before changing project files"
    turn_limited = False
