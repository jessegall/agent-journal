from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class WorkerRunUnstartedNudge(NudgeDeclaration):
    """The nudge workers.worker_run_unstarted."""

    key = "workers.worker_run_unstarted"
    type = NudgeType.STEERING
    text = "phase:{phase} tests could not start on your commit; nothing failed: continue, your next commit starts them"
    turn_limited = False
