from engine.driver.nudge_declaration import NudgeDeclaration
from engine.driver.interval import Interval
from engine.driver.seconds import Seconds
from engine.enums.nudge_type import NudgeType


class WorkerUnmergedNudge(NudgeDeclaration):
    """The nudge workers.worker_unmerged."""

    key = "workers.worker_unmerged"
    type = NudgeType.STEERING
    text = "worker:{worker} committed {tasks}, not merged: {action}"
    interval = Interval(Seconds(300))
    turn_limited = False
    wakes_agent = True
    plural_text = 'workers {worker} committed {tasks}, unmerged: {action}'
    id_field = "worker"
