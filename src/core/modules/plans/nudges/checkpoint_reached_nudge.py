from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class CheckpointReachedNudge(NudgeDeclaration):
    """The nudge plans.checkpoint_reached."""

    key = "plans.checkpoint_reached"
    type = NudgeType.STEERING
    text = "plan {plan}: phase {phase} is done and is a checkpoint: later phases wait for its tests"
    turn_limited = False
