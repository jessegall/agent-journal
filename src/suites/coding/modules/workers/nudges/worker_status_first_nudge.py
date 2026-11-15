from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class WorkerStatusFirstNudge(NudgeDeclaration):
    """The nudge workers.status_first."""

    key = "workers.status_first"
    type = NudgeType.REFUSAL
    text = "After a compaction, read your worker status first"
