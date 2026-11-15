from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class UpdateSkippedNudge(NudgeDeclaration):
    """The nudge workers.worktree_update_not_run."""

    key = "workers.worktree_update_not_run"
    type = NudgeType.STEERING
    text = "worker:{worker} has not run the ordered update"
    turn_limited = False
    wakes_agent = True
