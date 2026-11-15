from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class SmallBatchNudge(NudgeDeclaration):
    """The nudge workers.small_batch."""

    key = "workers.small_batch"
    type = NudgeType.STEERING
    text = "Batch of {count}: queue more tasks per worker; a long batch interrupts you less"
    turn_limited = False
