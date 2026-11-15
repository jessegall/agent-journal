from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class WorkerMergedNudge(NudgeDeclaration):
    """The nudge workers.worker_merged."""

    key = "workers.worker_merged"
    type = NudgeType.STEERING
    text = "worker:{worker} was merged"
    plural_text = "workers {worker} were merged"
    id_field = "worker"
    wakes_agent = True
