from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class MergerUpdateFailedNudge(NudgeDeclaration):
    """The nudge workers.worktree_update_failed."""

    key = "workers.worktree_update_failed"
    type = NudgeType.STEERING
    text = "worker:{worker} update failed and changed nothing: journal behind-check show {check} says why"
    turn_limited = False
    wakes_agent = True
    full_text = True
