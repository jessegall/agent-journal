from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class MergerWorkerRunUnstartedNudge(NudgeDeclaration):
    """The nudge workers.merger_worker_run_unstarted."""

    key = "workers.merger_worker_run_unstarted"
    type = NudgeType.STEERING
    text = "Checkpoint phase:{phase} tests could not start on a commit of worker:{worker}"
    turn_limited = False
