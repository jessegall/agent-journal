from engine.driver.nudge_declaration import NudgeDeclaration
from engine.driver.interval import Interval
from engine.driver.seconds import Seconds
from engine.enums.nudge_type import NudgeType


class WorkerProcessEndedNudge(NudgeDeclaration):
    """The nudge workers.process_ended."""

    key = "workers.process_ended"
    type = NudgeType.STEERING
    text = "worker:{worker} is stopped and will not restart: its process ended, {tasks}"
    interval = Interval(Seconds(300))
    turn_limited = False
    wakes_agent = True
