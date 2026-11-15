from engine.driver.nudge_declaration import NudgeDeclaration
from engine.driver.interval import Interval
from engine.driver.seconds import Seconds
from engine.enums.nudge_type import NudgeType


class WorkerUnstartedNudge(NudgeDeclaration):
    """The nudge workers.unstarted."""

    key = "workers.unstarted"
    type = NudgeType.STEERING
    text = "worker:{worker} made no call in {seconds}s"
    interval = Interval(Seconds(600))
    turn_limited = False
    wakes_agent = True
    plural_text = 'workers {worker} made no call in {seconds} seconds'
    id_field = "worker"
