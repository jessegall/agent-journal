from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class WorkerCommittedUnmergedNudge(NudgeDeclaration):
    """The nudge workers.committed_unmerged."""

    key = "workers.committed_unmerged"
    type = NudgeType.STEERING
    text = "{tasks} of worker:{worker} are committed but not merged"
    turn_limited = False
