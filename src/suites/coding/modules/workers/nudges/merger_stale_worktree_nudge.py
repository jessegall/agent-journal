from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class MergerStaleWorktreeNudge(NudgeDeclaration):
    """The nudge workers.worktree_behind."""

    key = "workers.worktree_behind"
    type = NudgeType.STEERING
    text = "worker:{worker} is {count} commits behind its base branch"
    turn_limited = False
    wakes_agent = True
