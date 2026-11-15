from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class ConflictOpenNudge(NudgeDeclaration):
    """The nudge workers.worktree_clash_open."""

    key = "workers.worktree_clash_open"
    type = NudgeType.STEERING
    text = "worker:{worker} update left conflict markers open: read them and advise it once"
    turn_limited = False
    wakes_agent = True
    full_text = True
