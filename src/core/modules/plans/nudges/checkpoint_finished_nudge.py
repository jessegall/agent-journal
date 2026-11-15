from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class CheckpointFinishedNudge(NudgeDeclaration):
    """The nudge plans.checkpoint_finished."""

    key = "plans.checkpoint_finished"
    type = NudgeType.STEERING
    text = "plan {plan}: checkpoint phase {phase} tests passed and later phases are open: tell the user"
    turn_limited = False
