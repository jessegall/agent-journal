from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class CheckpointAwaitsApprovalNudge(NudgeDeclaration):
    """The nudge plans.checkpoint_awaits_approval."""

    key = "plans.checkpoint_awaits_approval"
    type = NudgeType.STEERING
    text = "plan {plan}: checkpoint phase {phase} passed its tests; later phases open once a user approves it on the plan card"
    turn_limited = False
