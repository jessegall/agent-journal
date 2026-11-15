from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class CheckpointFailureFallbackNudge(NudgeDeclaration):
    """The nudge workers.checkpoint_failure_fallback."""

    key = "workers.checkpoint_failure_fallback"
    type = NudgeType.STEERING
    text = "A failed test of checkpoint phase:{phase} names no task: task:{task} was sent back, output {outputs}"
    turn_limited = False
