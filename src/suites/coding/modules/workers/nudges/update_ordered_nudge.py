from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class UpdateOrderedNudge(NudgeDeclaration):
    """The nudge workers.worktree_update_ordered."""

    key = "workers.worktree_update_ordered"
    type = NudgeType.STEERING
    text = "Your base branch moved {count} commits: update your worktree at your next stopping point."
    turn_limited = False
    wakes_agent = True
    full_text = True
