from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class WorkerMergeConflictNudge(NudgeDeclaration):
    """The nudge workers.merge_clash."""

    key = "workers.merge_clash"
    type = NudgeType.STEERING
    text = "{branch} merged into your worktree and clashes on {lines}: {line}"
    turn_limited = False
    path_fields = ["lines", "line"]
