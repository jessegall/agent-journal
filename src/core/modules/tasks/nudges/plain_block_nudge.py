from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class PlainBlockNudge(NudgeDeclaration):
    """The nudge tasks.plain_block."""

    key = "tasks.plain_block"
    type = NudgeType.STEERING
    text = "Block with --on {targets} or --until; a plain reason waits on a user"
    turn_limited = False
