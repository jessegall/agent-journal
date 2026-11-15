from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class FastForwardedNudge(NudgeDeclaration):
    """The nudge workers.worktree_fast_forwarded."""

    key = "workers.worktree_fast_forwarded"
    type = NudgeType.STEERING
    text = "your worktree moved up to its base branch; nothing of yours was touched"
    turn_limited = False
