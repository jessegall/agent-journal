from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class WorkerReadRefusalNudge(NudgeDeclaration):
    """The nudge workers.read_outside_worktree."""

    key = "workers.read_outside_worktree"
    type = NudgeType.REFUSAL
    text = "That file is outside your worktree: use what is in your worktree, or ask in your report"
