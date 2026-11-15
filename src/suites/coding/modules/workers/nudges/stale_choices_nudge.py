from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class StaleChoicesNudge(NudgeDeclaration):
    """The nudge workers.worktree_behind_choices."""

    key = "workers.worktree_behind_choices"
    type = NudgeType.STEERING
    text = "worker:{worker} is {count} commits behind: order its update, leave it or pass it"
    turn_limited = False
    wakes_agent = True
    full_text = True
