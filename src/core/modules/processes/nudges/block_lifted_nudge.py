from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class BlockLiftedNudge(NudgeDeclaration):
    """The nudge processes.block_lifted."""

    key = "processes.block_lifted"
    type = NudgeType.STEERING
    text = "A user lifted the block on reader request {request}"
