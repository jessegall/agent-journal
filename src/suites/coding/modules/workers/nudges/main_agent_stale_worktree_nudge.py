from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class MainAgentStaleWorktreeNudge(NudgeDeclaration):
    """The nudge workers.worktree_behind_main."""

    key = "workers.worktree_behind_main"
    type = NudgeType.STEERING
    text = "worker:{worker} is {count} commits behind, too far to leave to the merger: decide whether it updates"
    turn_limited = False
    wakes_agent = True
