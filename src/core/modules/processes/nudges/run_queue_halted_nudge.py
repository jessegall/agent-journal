from engine.driver.nudge_declaration import NudgeDeclaration
from engine.driver.interval import Interval
from engine.driver.seconds import Seconds
from engine.enums.nudge_type import NudgeType


class RunQueueHaltedNudge(NudgeDeclaration):
    """The nudge processes.run_queue_halted."""

    key = "processes.run_queue_halted"
    type = NudgeType.STEERING
    text = "The process queue is halted, so no queued run starts: resume it when it may continue"
    interval = Interval(Seconds(300))
    turn_limited = False
