from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class ConflictRepeatedNudge(NudgeDeclaration):
    """The nudge workers.worktree_clash_still_open."""

    key = "workers.worktree_clash_still_open"
    type = NudgeType.STEERING
    text = "worker:{worker} still has conflict markers after your advice: pass it to the main agent"
    turn_limited = False
    wakes_agent = True
    full_text = True
