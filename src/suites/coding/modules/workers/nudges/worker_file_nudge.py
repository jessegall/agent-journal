from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class WorkerFileNudge(NudgeDeclaration):
    """The nudge workers.file_is_the_workers."""

    key = "workers.file_is_the_workers"
    type = NudgeType.REFUSAL
    text = "That file is in worker {worker}'s worktree: send the worker a job, or wait for its delivery"
    turn_limited = False
