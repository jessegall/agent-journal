from engine.driver.nudge_declaration import NudgeDeclaration
from engine.driver.interval import Interval
from engine.driver.seconds import Seconds
from engine.enums.nudge_type import NudgeType


class WorkerAskingStoppedNudge(NudgeDeclaration):
    """The nudge workers.asking_stopped."""

    key = "workers.asking_stopped"
    type = NudgeType.STEERING
    text = "worker:{worker} is stopped and will not restart: its question is unanswered, {tasks}"
    interval = Interval(Seconds(1800))
    turn_limited = False
    wakes_agent = True
