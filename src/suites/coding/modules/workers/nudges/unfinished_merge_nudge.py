from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class UnfinishedMergeNudge(NudgeDeclaration):
    """The nudge workers.unfinished-merge: a merger's stop is refused while a merge it started still runs."""

    key = "workers.unfinished-merge"
    type = NudgeType.STEERING
    text = "Your merge of worker {worker} is still running: wait for it to end, then stop"
