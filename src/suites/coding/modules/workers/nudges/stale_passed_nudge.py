from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class StalePassedNudge(NudgeDeclaration):
    """The nudge workers.worktree_behind_passed."""

    key = "workers.worktree_behind_passed"
    type = NudgeType.STEERING
    text = "the merger passed worker:{worker} to you with behind check {check}: decide whether it updates"
    turn_limited = False
    wakes_agent = True
    full_text = True
